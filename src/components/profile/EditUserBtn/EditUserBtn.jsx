import Icon from '../../ui/Icon/Icon';
import styles from './EditUserBtn.module.css';

export default function EditUserBtn({ onClick, variant = 'corner' }) {
  const isAvatar = variant === 'avatar';

  return (
    <button
      type="button"
      className={`${styles.btn} ${isAvatar ? styles.avatarBtn : styles.cornerBtn}`}
      onClick={onClick}
      aria-label="Edit profile"
    >
      <Icon name={isAvatar ? 'user' : 'edit'} size={isAvatar ? 50 : 18} />
    </button>
  );
}
