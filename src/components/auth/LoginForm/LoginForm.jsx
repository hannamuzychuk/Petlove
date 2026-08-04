import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { loginSchema } from '../../../validation/authSchemas';
import { loginUser } from '../../../services/authApi';
import Button from '../../ui/Button/Button';
import FormField from '../../ui/FormField/FormField';
import { isFieldSuccess } from '../../ui/FormField/formFieldUtils';
import fieldStyles from '../../ui/FormField/FormField.module.css';
import Icon from '../../ui/Icon/Icon';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getFieldState,
    formState,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const { errors, isSubmitting } = formState;
  const emailValue = watch('email', '');
  const passwordValue = watch('password', '');

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
        <FormField
          id="login-email"
          label="Email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email?.message}
          success={isFieldSuccess(getFieldState('email', formState), emailValue)}
          {...register('email')}
        />

        <FormField
          id="login-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          success={isFieldSuccess(
            getFieldState('password', formState),
            passwordValue,
          )}
          endAdornment={
            <button
              type="button"
              className={fieldStyles.eyeBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eye' : 'eye-off'} size={18} />
            </button>
          }
          {...register('password')}
        />
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
