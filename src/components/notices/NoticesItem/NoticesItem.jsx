import { useState } from 'react';
import { useSelector } from 'react-redux';

import Icon from '../../ui/Icon/Icon';
import styles from './NoticesItem.module.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString || '—';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function formatPrice(price) {
  if (price === undefined || price === null || price === '') return null;
  const num = Number(price);
  if (Number.isNaN(num)) return null;
  return `$${num.toFixed(2)}`;
}

export default function NoticesItem({ item, onLearnMore, onRequireAuth }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isFavorite, setIsFavorite] = useState(false);
  const image = item.imgURL || item.imgUrl || '';
  const price = formatPrice(item.price);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    setIsFavorite((prev) => !prev);
  };

  return (
    <li className={styles.item}>
      <img
        className={styles.image}
        src={image}
        alt={item.title}
        loading="lazy"
      />
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.top}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.popularity}>
              <Icon name="star" size={16} />
              <span>{item.popularity}</span>
            </p>
          </div>
          <ul className={styles.meta}>
            <li>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{item.name}</span>
            </li>
            <li>
              <span className={styles.label}>Birthday</span>
              <span className={styles.value}>{formatDate(item.birthday)}</span>
            </li>
            <li>
              <span className={styles.label}>Sex</span>
              <span className={styles.value}>{item.sex}</span>
            </li>
            <li>
              <span className={styles.label}>Species</span>
              <span className={styles.value}>{item.species}</span>
            </li>
            <li>
              <span className={styles.label}>Category</span>
              <span className={styles.value}>{item.category}</span>
            </li>
          </ul>
          <p className={styles.comment}>{item.comment}</p>
        </div>

        <div className={styles.footer}>
          {price ? <p className={styles.price}>{price}</p> : null}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.learnMore}
              onClick={() => onLearnMore?.(item)}
            >
              Learn more
            </button>
            <button
              type="button"
              className={`${styles.favorite} ${
                isFavorite ? styles.favoriteActive : ''
              }`}
              aria-label={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
              aria-pressed={isFavorite}
              onClick={handleFavoriteClick}
            >
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                className={styles.heartIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
