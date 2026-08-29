import * as Yup from 'yup';

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const avatarRegex = /^https:\/\/.+\.(?:png|jpg|jpeg|gif|bmp|webp)$/i;
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
      message: 'Select a valid image (png, jpg, jpeg, gif, bmp, webp)',
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
    .matches(
      avatarRegex,
      'The imgURL must be in format https://XXXX.png|jpg|jpeg|gif|bmp|webp',
    )
    .required('Photo is required'),
  species: Yup.string().required('Species is required'),
  birthday: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD')
    .test('not-future', 'Date cannot be in the future', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      return date <= today;
    })
    .required('Birthday is required'),
  sex: Yup.string()
    .oneOf(['female', 'male', 'multiple'])
    .required('Sex is required'),
});
