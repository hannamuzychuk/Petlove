import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { registerSchema } from '../../../validation/authSchemas';
import { registerUser } from '../../../services/authApi';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import styles from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values) => {
    try {
      const { name, email, password } = values;
      await dispatch(registerUser({ name, email, password }));
      toast.success('Registration successful');
      navigate('/profile');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label className={styles.visuallyHidden} htmlFor="register-name">
            Name
          </label>
          <input
            id="register-name"
            className={styles.input}
            type="text"
            placeholder="Name"
            autoComplete="name"
            {...register('name')}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.visuallyHidden} htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            className={styles.input}
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.visuallyHidden} htmlFor="register-password">
            Password
          </label>
          <div className={styles.inputWrap}>
            <input
              id="register-password"
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="new-password"
              {...register('password')}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eye' : 'eye-off'} size={18} />
            </button>
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label
            className={styles.visuallyHidden}
            htmlFor="register-confirm-password"
          >
            Confirm password
          </label>
          <div className={styles.inputWrap}>
            <input
              id="register-confirm-password"
              className={styles.input}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              <Icon name={showConfirmPassword ? 'eye' : 'eye-off'} size={18} />
            </button>
          </div>
          {errors.confirmPassword && (
            <span className={styles.error}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="filled"
          className={styles.submit}
          disabled={isSubmitting}
        >
          Registration
        </Button>

        <p className={styles.hint}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </form>
  );
}
