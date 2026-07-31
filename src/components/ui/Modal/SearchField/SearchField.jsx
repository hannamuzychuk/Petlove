import Icon from '../../Icon/Icon';
import styles from './SearchField.module.css';

export default function SearchField({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search',
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />

      {value && (
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onClear}
          aria-label="Clear"
        >
          <Icon name="close-menu" size={18} />
        </button>
      )}

      <button type="submit" className={styles.iconBtn} aria-label="Search">
        <Icon name="search" size={18} />
      </button>
    </form>
  );
}
