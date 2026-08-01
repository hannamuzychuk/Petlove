import NoticesItem from '../NoticesItem/NoticesItem';
import styles from './NoticesList.module.css';

export default function NoticesList({ items, onLearnMore, onRequireAuth }) {
  if (!items?.length) {
    return <p className={styles.empty}>No notices found.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <NoticesItem
          key={item._id}
          item={item}
          onLearnMore={onLearnMore}
          onRequireAuth={onRequireAuth}
        />
      ))}
    </ul>
  );
}
