import EditUserBtn from '../EditUserBtn/EditUserBtn';
import styles from './UserBlock.module.css';

export default function UserBlock({ user, onEdit }) {
  if (!user) return null;

  const hasPhone = Boolean(user.phone);
  const hasAvatar = Boolean(user.avatar);

  return (
    <div className={styles.block}>
      <div className={styles.avatarBlock}>
        {hasAvatar ? (
          <div className={styles.avatarWrap}>
            <img
              className={styles.avatar}
              src={user.avatar}
              alt={`${user.name} avatar`}
            />
          </div>
        ) : (
          <>
            <EditUserBtn variant="avatar" onClick={onEdit} />
            <span className={styles.uploadLabel}>Upload photo</span>
          </>
        )}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>My information</h2>
        <ul className={styles.list}>
          <li className={`${styles.item} ${styles.itemAccent}`}>{user.name}</li>
          <li className={`${styles.item} ${styles.itemAccent}`}>{user.email}</li>
          <li className={`${styles.item} ${hasPhone ? styles.itemAccent : ''}`}>
            {user.phone || '+380'}
          </li>
        </ul>
      </div>
    </div>
  );
}
