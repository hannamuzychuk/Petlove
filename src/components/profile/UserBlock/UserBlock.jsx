import Icon from '../../ui/Icon/Icon';
import styles from './UserBlock.module.css';

export default function UserBlock({ user }) {
  if (!user) return null;

  const hasPhone = Boolean(user.phone);

  return (
    <div className={styles.block}>
      <div className={styles.avatarBlock}>
        <div className={styles.avatarWrap}>
          {user.avatar ? (
            <img
              className={styles.avatar}
              src={user.avatar}
              alt={`${user.name} avatar`}
            />
          ) : (
            <span className={styles.avatarFallback}>
              <Icon name="user" size={50} />
            </span>
          )}
        </div>
        {!user.avatar ? (
          <span className={styles.uploadLabel}>Upload photo</span>
        ) : null}
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
