import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import Modal from '../../ui/Modal/Modal';
import Icon from '../../ui/Icon/Icon';
import FormField from '../../ui/FormField/FormField';
import { isFieldSuccess } from '../../ui/FormField/formFieldUtils';
import { editUserSchema } from '../../../validation/profileSchemas';
import { editCurrentUser } from '../../../services/usersApi';
import { setUser } from '../../../redux/authSlice';
import { uploadImageFile } from '../../../utils/imageFile';
import styles from './ModalEditUser.module.css';

const getDefaults = (user) => ({
  name: user?.name ?? '',
  email: user?.email ?? '',
  avatar: user?.avatar ?? '',
  phone: user?.phone ?? '',
});

export default function ModalEditUser({ isOpen, onClose, user }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getFieldState,
    formState,
  } = useForm({
    resolver: yupResolver(editUserSchema),
    mode: 'onBlur',
    defaultValues: getDefaults(user),
  });

  const { errors, isSubmitting } = formState;
  const avatar = watch('avatar');
  const nameValue = watch('name', '');
  const emailValue = watch('email', '');
  const phoneValue = watch('phone', '');

  useEffect(() => {
    if (!isOpen) return;

    const defaults = getDefaults(user);
    reset(defaults);
    setPreviewUrl(defaults.avatar || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [isOpen, user, reset]);

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const url = await uploadImageFile(file);
      setValue('avatar', url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setPreviewUrl(url);
    } catch (error) {
      toast.error(error.message || 'Failed to upload the selected image');
      setPreviewUrl('');
      setValue('avatar', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    } finally {
      URL.revokeObjectURL(localPreview);
      setIsReadingFile(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
      };

      const avatarValue = values.avatar?.trim();
      const phone = values.phone?.trim();

      if (avatarValue) {
        if (
          !/^https:\/\/.+\.(?:png|jpg|jpeg|gif|bmp|webp)$/i.test(avatarValue)
        ) {
          toast.error('Please upload a photo from your device first');
          return;
        }
        payload.avatar = avatarValue;
      }
      if (phone) payload.phone = phone;

      const data = await editCurrentUser(payload);
      dispatch(setUser(data.user ?? data));
      toast.success('Profile updated');
      onClose();
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors.join(', ')
          : null) ||
        error.message ||
        'Failed to update profile';
      toast.error(apiMessage);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.editModal}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 className={styles.title}>Edit information</h2>

            <div className={styles.photoBlock}>
              <div className={styles.preview}>
                {previewUrl || avatar ? (
                  <img
                    className={styles.previewImage}
                    src={previewUrl || avatar}
                    alt="User avatar"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Icon name="user" size={40} />
                )}
              </div>

              <input
                ref={fileInputRef}
                className={styles.fileInput}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/bmp,image/webp"
                onChange={handleFileChange}
              />

              <button
                type="button"
                className={styles.uploadBtn}
                onClick={handlePickPhoto}
                disabled={isReadingFile}
              >
                {isReadingFile ? 'Loading...' : 'Upload photo'}
                <Icon name="upload" size={18} />
              </button>

              {errors.avatar ? (
                <span className={styles.fileError}>{errors.avatar.message}</span>
              ) : null}

              <input type="hidden" {...register('avatar')} />
            </div>
          </div>

          <div className={styles.inputs}>
            <FormField
              id="edit-name"
              label="Name"
              type="text"
              placeholder="Name"
              error={errors.name?.message}
              success={isFieldSuccess(
                getFieldState('name', formState),
                nameValue,
              )}
              {...register('name')}
            />

            <FormField
              id="edit-email"
              label="Email"
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              success={isFieldSuccess(
                getFieldState('email', formState),
                emailValue,
              )}
              {...register('email')}
            />

            <FormField
              id="edit-phone"
              label="Phone"
              type="tel"
              placeholder="+380XXXXXXXXX"
              error={errors.phone?.message}
              success={isFieldSuccess(
                getFieldState('phone', formState),
                phoneValue,
              )}
              {...register('phone')}
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.saveBtn}
          disabled={isSubmitting || isReadingFile}
        >
          <span className={styles.labelMobile}>Go to profile</span>
          <span className={styles.labelTablet}>Save</span>
        </button>
      </form>
    </Modal>
  );
}
