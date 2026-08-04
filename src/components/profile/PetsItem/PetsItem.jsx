import Icon from '../../ui/Icon/Icon';
import styles from './PetsItem.module.css';

function formatDate(dateString) {
  if (!dateString) return '—';
  if (typeof dateString === 'string' && dateString.includes('.')) {
    return dateString;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function capitalize(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '—';
}

export default function PetsItem({ pet, onRemove }) {
  const image = pet.imgURL || pet.imgUrl || '';

  return (
    <li className={styles.item}>
      {image ? (
        <img className={styles.image} src={image} alt={pet.name} />
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true" />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{pet.title}</h3>
        <ul className={styles.meta}>
          <li>
            <span className={styles.label}>Name</span>
            <span>{pet.name}</span>
          </li>
          <li>
            <span className={styles.label}>Birthday</span>
            <span>{formatDate(pet.birthday)}</span>
          </li>
          <li>
            <span className={styles.label}>Sex</span>
            <span>{capitalize(pet.sex)}</span>
          </li>
          <li>
            <span className={styles.label}>Species</span>
            <span>{capitalize(pet.species)}</span>
          </li>
        </ul>
      </div>
      <button
        type="button"
        className={styles.removeBtn}
        aria-label={`Remove ${pet.name}`}
        onClick={() => onRemove?.(pet._id)}
      >
        <Icon name="trash" size={16} />
      </button>
    </li>
  );
}
