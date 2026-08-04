import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { registerSchema } from '../../../validation/authSchemas';
import { registerUser } from '../../../services/authApi';
import Button from '../../ui/Button/Button';
import FormField from '../../ui/FormField/FormField';
import { isFieldSuccess } from '../../ui/FormField/formFieldUtils';
import fieldStyles from '../../ui/FormField/FormField.module.css';
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
    watch,
    getFieldState,
    formState,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
  });

  const { errors, isSubmitting } = formState;
  const nameValue = watch('name', '');
  const emailValue = watch('email', '');
  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  const isPasswordSecure =
    typeof passwordValue === 'string' &&
    passwordValue.length >= 7 &&
    !errors.password &&
    getFieldState('password', formState).isTouched;

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
        <FormField
          id="register-name"
          label="Name"
          type="text"
          placeholder="Name"
          autoComplete="name"
          error={errors.name?.message}
          success={isFieldSuccess(getFieldState('name', formState), nameValue)}
          {...register('name')}
        />

        <FormField
          id="register-email"
          label="Email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email?.message}
          success={isFieldSuccess(getFieldState('email', formState), emailValue)}
          {...register('email')}
        />

        <FormField
          id="register-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          success={isPasswordSecure}
          successMessage="Password is secure"
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

        <FormField
          id="register-confirm-password"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          success={isFieldSuccess(
            getFieldState('confirmPassword', formState),
            confirmPasswordValue,
          )}
          endAdornment={
            <button
              type="button"
              className={fieldStyles.eyeBtn}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={18}
              />
            </button>
          }
          {...register('confirmPassword')}
        />
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
