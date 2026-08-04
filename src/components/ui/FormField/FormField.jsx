import { forwardRef } from 'react';

import Icon from '../Icon/Icon';
import styles from './FormField.module.css';

const FormField = forwardRef(function FormField(
  {
    id,
    label,
    error,
    success = false,
    successMessage,
    endAdornment,
    size = 'md',
    className = '',
    inputClassName = '',
    ...inputProps
  },
  ref,
) {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const hasStatus = hasError || hasSuccess;
  const hasActions = hasStatus || Boolean(endAdornment);
  const hasActionsWide = hasStatus && Boolean(endAdornment);
  const iconSize = size === 'sm' ? 18 : 18;

  return (
    <div
      className={[
        styles.field,
        size === 'sm' ? styles.sm : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label ? (
        <label className={styles.visuallyHidden} htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div
        className={[
          styles.inputWrap,
          hasActions ? styles.hasActions : '',
          hasActionsWide ? styles.hasActionsWide : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          id={id}
          ref={ref}
          className={[
            styles.input,
            hasError ? styles.inputError : '',
            hasSuccess ? styles.inputSuccess : '',
            inputClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={hasError || undefined}
          {...inputProps}
        />

        {hasActions ? (
          <div className={styles.inputActions}>
            {hasError ? (
              <span
                className={`${styles.statusIcon} ${styles.statusIconError}`}
                aria-hidden="true"
              >
                <Icon name="cross" size={iconSize} />
              </span>
            ) : null}
            {hasSuccess ? (
              <span
                className={`${styles.statusIcon} ${styles.statusIconSuccess}`}
                aria-hidden="true"
              >
                <Icon name="check" size={iconSize} />
              </span>
            ) : null}
            {endAdornment}
          </div>
        ) : null}
      </div>

      {hasError ? <span className={styles.error}>{error}</span> : null}
      {hasSuccess && successMessage ? (
        <span className={styles.success}>{successMessage}</span>
      ) : null}
    </div>
  );
});

export default FormField;
