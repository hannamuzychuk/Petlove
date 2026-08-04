import { useEffect, useState } from 'react';
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
import styles from './ModalEditUser.module.css';

const getDefaults = (user) => ({
  name: user?.name ?? '',
  email: user?.email ?? '',
  avatar: user?.avatar ?? '',
  phone: user?.phone ?? '',
});

export default function ModalEditUser({ isOpen, onClose, user }) {
  const dispatch = useDispatch();
  const [previewUrl, setPreviewUrl] = useState('');

  const {
    register,
    handleSubmit,
    reset,
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
  }, [isOpen, user, reset]);

  const handleUploadPhoto = () => {
    if (!avatar || errors.avatar) {
      toast.error('Enter a valid image URL first');
      return;
    }
    setPreviewUrl(avatar);
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
      };

      const avatarValue = values.avatar?.trim();
      const phone = values.phone?.trim();

      if (avatarValue) payload.avatar = avatarValue;
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

              <div className={styles.urlRow}>
                <FormField
                  id="edit-avatar"
                  label="Avatar URL"
                  type="url"
                  placeholder="Enter URL"
                  className={styles.urlField}
                  error={errors.avatar?.message}
                  success={isFieldSuccess(
                    getFieldState('avatar', formState),
                    avatar,
                  )}
                  {...register('avatar')}
                />

                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={handleUploadPhoto}
                >
                  Upload photo
                  <Icon name="upload" size={18} />
                </button>
              </div>
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
          disabled={isSubmitting}
        >
          <span className={styles.labelMobile}>Go to profile</span>
          <span className={styles.labelTablet}>Save</span>
        </button>
      </form>
    </Modal>
  );
}
