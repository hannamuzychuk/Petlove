import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { components } from 'react-select';
import toast from 'react-hot-toast';

import Icon from '../../ui/Icon/Icon';
import { addPetSchema } from '../../../validation/profileSchemas';
import { addPet } from '../../../services/usersApi';
import { getSpeciesOptions } from '../../../services/noticesApi';
import { setUserPets } from '../../../redux/authSlice';
import styles from './AddPetForm.module.css';

const SEX_OPTIONS = [
  { value: 'female', icon: 'female', className: styles.sexFemale },
  { value: 'male', icon: 'male', className: styles.sexMale },
  { value: 'multiple', icon: 'multiple', className: styles.sexMultiple },
];

const capitalize = (value = '') =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const toApiBirthday = (value) => {
  const [day, month, year] = value.split('.');
  return `${year}-${month}-${day}`;
};

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <Icon name="vector" size={18} />
  </components.DropdownIndicator>
);

export default function AddPetForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addPetSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      name: '',
      imgURL: '',
      species: '',
      birthday: '',
      sex: '',
    },
  });

  const sex = watch('sex');
  const imgURL = watch('imgURL');

  const typeOptions = useMemo(
    () =>
      speciesOptions.map((item) => ({
        value: item,
        label: capitalize(item),
      })),
    [speciesOptions],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSpeciesOptions();
        setSpeciesOptions(data ?? []);
      } catch {
        setSpeciesOptions([]);
      }
    };

    load();
  }, []);

  const handleUploadPhoto = () => {
    if (!imgURL || errors.imgURL) {
      toast.error('Enter a valid image URL first');
      return;
    }
    setPreviewUrl(imgURL);
  };

  const onSubmit = async (values) => {
    try {
      const data = await addPet({
        title: values.title,
        name: values.name,
        imgURL: values.imgURL,
        species: values.species,
        birthday: toApiBirthday(values.birthday),
        sex: values.sex,
      });

      if (Array.isArray(data?.pets)) {
        dispatch(setUserPets(data.pets));
      } else if (Array.isArray(data?.user?.pets)) {
        dispatch(setUserPets(data.user.pets));
      }

      toast.success('Pet added');
      navigate('/profile');
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to add pet',
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          Add my pet <span className={styles.titleSlash}>/</span>
        </h1>
        <span className={styles.subtitle}>Personal details</span>
      </div>

      <div
        className={styles.sex}
        role="radiogroup"
        aria-label="Pet sex"
      >
        {SEX_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={sex === option.value}
            aria-label={option.value}
            className={`${styles.sexBtn} ${option.className} ${
              sex === option.value ? styles.sexActive : ''
            }`}
            onClick={() =>
              setValue('sex', option.value, { shouldValidate: true })
            }
          >
            <Icon name={option.icon} size={option.value === 'female' ? 20 : 24} />
          </button>
        ))}
      </div>
      {errors.sex ? (
        <span className={styles.error}>{errors.sex.message}</span>
      ) : null}

      <div className={styles.photoBlock}>
        <div className={styles.preview}>
          {previewUrl || imgURL ? (
            <img
              className={styles.previewImage}
              src={previewUrl || imgURL}
              alt="Pet preview"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Icon name="paw" size={44} className={styles.pawIcon} />
          )}
        </div>

        <div className={styles.urlRow}>
          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="pet-url">
              Image URL
            </label>
            <input
              id="pet-url"
              className={styles.urlInput}
              type="url"
              placeholder="Enter URL"
              {...register('imgURL')}
            />
            {errors.imgURL ? (
              <span className={styles.error}>{errors.imgURL.message}</span>
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
          <label className={styles.visuallyHidden} htmlFor="pet-title">
            Title
          </label>
          <input
            id="pet-title"
            className={styles.input}
            type="text"
            placeholder="Title"
            {...register('title')}
          />
          {errors.title ? (
            <span className={styles.error}>{errors.title.message}</span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.visuallyHidden} htmlFor="pet-name">
            Pet&apos;s Name
          </label>
          <input
            id="pet-name"
            className={styles.input}
            type="text"
            placeholder="Pet’s Name"
            {...register('name')}
          />
          {errors.name ? (
            <span className={styles.error}>{errors.name.message}</span>
          ) : null}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="pet-birthday">
              Birthday
            </label>
            <div className={styles.inputWrap}>
              <input
                id="pet-birthday"
                className={styles.input}
                type="text"
                placeholder="00.00.0000"
                {...register('birthday')}
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <Icon name="calendar" size={20} />
              </span>
            </div>
            {errors.birthday ? (
              <span className={styles.error}>{errors.birthday.message}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="pet-species">
              Type of pet
            </label>
            <Controller
              name="species"
              control={control}
              render={({ field }) => (
                <Select
                  inputId="pet-species"
                  className={styles.select}
                  classNamePrefix="petType"
                  options={typeOptions}
                  placeholder="Type of pet"
                  value={
                    typeOptions.find((option) => option.value === field.value) ||
                    null
                  }
                  onChange={(option) => field.onChange(option?.value || '')}
                  onBlur={field.onBlur}
                  components={{ DropdownIndicator, IndicatorSeparator: null }}
                  isSearchable={false}
                />
              )}
            />
            {errors.species ? (
              <span className={styles.error}>{errors.species.message}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to="/profile" className={styles.backBtn}>
          Back
        </Link>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
