import * as Yup from 'yup';

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const avatarRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/i;
const phoneRegex = /^\+38\d{10}$/;

export const editUserSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .matches(emailRegex, 'Enter a valid Email')
    .required('Email is required'),
  avatar: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .matches(avatarRegex, {
      message: 'Enter a valid image URL (png, jpg, jpeg, gif, bmp, webp)',
      excludeEmptyString: true,
    }),
  phone: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .matches(phoneRegex, {
      message: 'Enter a valid phone (+38...)',
      excludeEmptyString: true,
    }),
});

export const addPetSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  name: Yup.string().required('Name is required'),
  imgURL: Yup.string()
    .matches(avatarRegex, 'Enter a valid image URL (png, jpg, jpeg, gif, bmp, webp)')
    .required('Image URL is required'),
  species: Yup.string().required('Species is required'),
  birthday: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD')
    .required('Birthday is required'),
  sex: Yup.string()
    .oneOf(['female', 'male', 'multiple'])
    .required('Sex is required'),
});
