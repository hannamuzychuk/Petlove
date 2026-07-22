import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { loginSchema } from '../../../validation/authSchemas';
import { loginUser } from '../../../services/authApi';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values) => {
    try {
      const { email, password } = values;
      await dispatch(loginUser({ email, password }));
      toast.success('Login successful');
      navigate('/profile');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label className={styles.visuallyHidden} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
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
          <label className={styles.visuallyHidden} htmlFor="login-password">
            Password
          </label>
          <div className={styles.inputWrap}>
            <input
              id="login-password"
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
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
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="filled"
          className={styles.submit}
          disabled={isSubmitting}
        >
          Log In
        </Button>

        <p className={styles.hint}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </form>
  );
}
