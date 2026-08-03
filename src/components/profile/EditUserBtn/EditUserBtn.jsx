import Icon from '../../ui/Icon/Icon';
import styles from './EditUserBtn.module.css';

export default function EditUserBtn({ onClick }) {
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      aria-label="Edit profile"
    >
      <Icon name="edit" size={18} />
    </button>
  );
}
