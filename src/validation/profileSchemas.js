import * as Yup from 'yup';

const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^\+38\d{10}$/; 
const urlRegex = /^https?:\/\/.+/i;

export const editUserSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .matches(emailRegex, 'Enter a valid Email')
    .required('Email is required'),
  avatar: Yup.string().url('Enter a valid URL').nullable().transform((v) => v || null),
  phone: Yup.string()
    .matches(phoneRegex, 'Enter a valid phone (+38...)')
    .nullable(),
});

export const addPetSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  name: Yup.string().required('Name is required'),
  imgURL: Yup.string()
    .matches(urlRegex, 'Enter a valid image URL')
    .required('Image URL is required'),
  species: Yup.string().required('Species is required'),
  birthday: Yup.string()
  .matches(/^\d{2}\.\d{2}\.\d{4}$/, 'Format: DD.MM.YYYY')
  .required('Birthday is required'),
  sex: Yup.string().oneOf(['female', 'male', 'multiple']).required('Sex is required'),
});