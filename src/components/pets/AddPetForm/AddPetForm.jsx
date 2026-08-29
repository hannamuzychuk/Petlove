import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { components } from 'react-select';
import toast from 'react-hot-toast';

import Icon from '../../ui/Icon/Icon';
import FormField from '../../ui/FormField/FormField';
import { isFieldSuccess } from '../../ui/FormField/formFieldUtils';
import fieldStyles from '../../ui/FormField/FormField.module.css';
import { addPetSchema } from '../../../validation/profileSchemas';
import { addPet } from '../../../services/usersApi';
import { getSpeciesOptions } from '../../../services/noticesApi';
import { setUserPets } from '../../../redux/authSlice';
import { uploadImageFile } from '../../../utils/imageFile';
import styles from './AddPetForm.module.css';

const SEX_OPTIONS = [
  { value: 'female', icon: 'female', className: styles.sexFemale },
  { value: 'male', icon: 'male', className: styles.sexMale },
  { value: 'multiple', icon: 'multiple', className: styles.sexMultiple },
];

const capitalize = (value = '') =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <Icon name="chevron-down" width={11} height={6} />
  </components.DropdownIndicator>
);

export default function AddPetForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getFieldState,
    formState,
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

  const { errors, isSubmitting } = formState;
  const sex = watch('sex');
  const imgURL = watch('imgURL');
  const titleValue = watch('title', '');
  const nameValue = watch('name', '');
  const birthdayValue = watch('birthday');
  const speciesValue = watch('species', '');
  const today = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const typeOptions = useMemo(
    () =>
      speciesOptions.map((item) => ({
        value: item,
        label: capitalize(item),
      })),
    [speciesOptions],
  );

  const birthdaySuccess = isFieldSuccess(
    getFieldState('birthday', formState),
    birthdayValue,
  );
  const speciesSuccess = isFieldSuccess(
    getFieldState('species', formState),
    speciesValue,
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

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const url = await uploadImageFile(file);
      setValue('imgURL', url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setPreviewUrl(url);
    } catch (error) {
      toast.error(error.message || 'Failed to upload the selected image');
      setPreviewUrl('');
      setValue('imgURL', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    } finally {
      URL.revokeObjectURL(localPreview);
      setIsReadingFile(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (values) => {
    try {
      const data = await addPet({
        title: values.title,
        name: values.name,
        imgURL: values.imgURL,
        species: values.species,
        birthday: values.birthday,
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

      <div className={styles.mediaBlock}>
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
                setValue('sex', option.value, {
                  shouldValidate: true,
                  shouldTouch: true,
                })
              }
            >
              <Icon name={option.icon} size={20} />
            </button>
          ))}
        </div>

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
            <Icon name="paw" size={34} className={styles.pawIcon} />
          )}
        </div>
      </div>
      {errors.sex ? (
        <span className={fieldStyles.error}>{errors.sex.message}</span>
      ) : null}

      <div className={styles.uploadRow}>
        <input
          ref={fileInputRef}
          className={styles.fileInput}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/bmp,image/webp"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={handlePickPhoto}
          disabled={isReadingFile}
        >
          {isReadingFile ? 'Loading...' : 'Upload photo'}
          <Icon name="upload" size={18} />
        </button>
        {errors.imgURL ? (
          <span className={fieldStyles.error}>{errors.imgURL.message}</span>
        ) : null}
        <input type="hidden" {...register('imgURL')} />
      </div>

      <div className={styles.inputs}>
        <FormField
          id="pet-title"
          label="Title"
          type="text"
          placeholder="Title"
          error={errors.title?.message}
          success={isFieldSuccess(getFieldState('title', formState), titleValue)}
          {...register('title')}
        />

        <FormField
          id="pet-name"
          label="Pet's Name"
          type="text"
          placeholder="Pet’s Name"
          error={errors.name?.message}
          success={isFieldSuccess(getFieldState('name', formState), nameValue)}
          {...register('name')}
        />

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="pet-birthday">
              Birthday
            </label>
            <div
              className={[
                styles.inputWrap,
                errors.birthday || birthdaySuccess ? styles.inputWrapStatus : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {!birthdayValue ? (
                <span className={styles.datePlaceholder}>00.00.0000</span>
              ) : null}
              <input
                id="pet-birthday"
                className={[
                  styles.input,
                  !birthdayValue ? styles.inputDateEmpty : '',
                  errors.birthday ? fieldStyles.inputError : '',
                  birthdaySuccess ? fieldStyles.inputSuccess : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="date"
                max={today}
                aria-invalid={Boolean(errors.birthday) || undefined}
                {...register('birthday')}
              />
              <div className={styles.inputTrailing}>
                {errors.birthday ? (
                  <span
                    className={`${fieldStyles.statusIcon} ${fieldStyles.statusIconError}`}
                    aria-hidden="true"
                  >
                    <Icon name="cross" size={18} />
                  </span>
                ) : null}
                {birthdaySuccess ? (
                  <span
                    className={`${fieldStyles.statusIcon} ${fieldStyles.statusIconSuccess}`}
                    aria-hidden="true"
                  >
                    <Icon name="check" size={18} />
                  </span>
                ) : null}
                <span className={styles.inputIcon} aria-hidden="true">
                  <Icon name="calendar" size={18} />
                </span>
              </div>
            </div>
            {errors.birthday ? (
              <span className={fieldStyles.error}>{errors.birthday.message}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="pet-species">
              Type of pet
            </label>
            <div
              className={[
                styles.selectWrap,
                errors.species || speciesSuccess ? styles.selectWrapStatus : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Controller
                name="species"
                control={control}
                render={({ field }) => (
                  <Select
                    inputId="pet-species"
                    className={[
                      styles.select,
                      errors.species ? styles.selectError : '',
                      speciesSuccess ? styles.selectSuccess : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    classNamePrefix="petType"
                    options={typeOptions}
                    placeholder="Type of pet"
                    value={
                      typeOptions.find(
                        (option) => option.value === field.value,
                      ) || null
                    }
                    onChange={(option) => field.onChange(option?.value || '')}
                    onBlur={field.onBlur}
                    components={{ DropdownIndicator, IndicatorSeparator: null }}
                    isSearchable={false}
                  />
                )}
              />
              {errors.species ? (
                <span
                  className={`${styles.selectStatus} ${fieldStyles.statusIcon} ${fieldStyles.statusIconError}`}
                  aria-hidden="true"
                >
                  <Icon name="cross" size={18} />
                </span>
              ) : null}
              {speciesSuccess ? (
                <span
                  className={`${styles.selectStatus} ${fieldStyles.statusIcon} ${fieldStyles.statusIconSuccess}`}
                  aria-hidden="true"
                >
                  <Icon name="check" size={18} />
                </span>
              ) : null}
            </div>
            {errors.species ? (
              <span className={fieldStyles.error}>{errors.species.message}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate('/profile')}
        >
          Back
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting || isReadingFile}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
