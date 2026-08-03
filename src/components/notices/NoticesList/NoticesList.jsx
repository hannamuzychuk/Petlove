import NoticesItem from '../NoticesItem/NoticesItem';
import styles from './NoticesList.module.css';

export default function NoticesList({
  items,
  onLearnMore,
  onRequireAuth,
  showRemoveFavorite = false,
  variant = 'default',
}) {
  if (!items?.length) {
    return <p className={styles.empty}>No notices found.</p>;
  }

  return (
    <ul
      className={`${styles.list} ${
        variant === 'profile' ? styles.profileList : ''
      }`}
    >
      {items.map((item) => (
        <NoticesItem
          key={item._id}
          item={item}
          onLearnMore={onLearnMore}
          onRequireAuth={onRequireAuth}
          showRemoveFavorite={showRemoveFavorite}
        />
      ))}
    </ul>
  );
}
