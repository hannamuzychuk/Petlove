import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import Modal from '../../ui/Modal/Modal';
import Icon from '../../ui/Icon/Icon';
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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(editUserSchema),
    mode: 'onBlur',
    defaultValues: getDefaults(user),
  });

  const avatar = watch('avatar');

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
        name: values.name,
        email: values.email,
        avatar: values.avatar || null,
        phone: values.phone || null,
      };

      const data = await editCurrentUser(payload);
      dispatch(setUser(data.user ?? data));
      toast.success('Profile updated');
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update profile',
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <div className={styles.field}>
              <label className={styles.visuallyHidden} htmlFor="edit-avatar">
                Avatar URL
              </label>
              <input
                id="edit-avatar"
                className={styles.urlInput}
                type="url"
                placeholder="https://..."
                {...register('avatar')}
              />
              {errors.avatar ? (
                <span className={styles.error}>{errors.avatar.message}</span>
              ) : null}
            </div>

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

        <div className={styles.inputs}>
          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              className={styles.input}
              type="text"
              placeholder="Name"
              {...register('name')}
            />
            {errors.name ? (
              <span className={styles.error}>{errors.name.message}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="edit-email">
              Email
            </label>
            <input
              id="edit-email"
              className={styles.input}
              type="email"
              placeholder="Email"
              {...register('email')}
            />
            {errors.email ? (
              <span className={styles.error}>{errors.email.message}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="edit-phone">
              Phone
            </label>
            <input
              id="edit-phone"
              className={styles.input}
              type="tel"
              placeholder="+380XXXXXXXXX"
              {...register('phone')}
            />
            {errors.phone ? (
              <span className={styles.error}>{errors.phone.message}</span>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className={styles.saveBtn}
          disabled={isSubmitting}
        >
          Save
        </button>
      </form>
    </Modal>
  );
}