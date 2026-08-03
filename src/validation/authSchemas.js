import * as Yup from 'yup';

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

export const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .matches(emailRegex, 'Enter a valid Email')
    .required('Email is required'),
  password: Yup.string()
    .min(7, 'Password must be at least 7 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, 'Enter a valid Email')
    .required('Email is required'),
  password: Yup.string()
    .min(7, 'Password must be at least 7 characters')
    .required('Password is required'),
});
