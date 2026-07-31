import NewsItem from '../NewsItem/NewsItem';
import styles from './NewsList.module.css';

export default function NewsList({ items }) {
  if (!items?.length) {
    return <p className={styles.empty}>No news found.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <NewsItem key={item._id} item={item} />
      ))}
    </ul>
  );
}
