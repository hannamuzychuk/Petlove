import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Icon from '../../ui/Icon/Icon';
import ModalCongrats from '../../ui/ModalCongrats/ModalCongrats';
import {
  addNoticeToFavorites,
  removeNoticeFromFavorites,
} from '../../../services/noticesApi';
import { setNoticesFavorites } from '../../../redux/authSlice';
import {
  getFavoriteId,
  resolveNoticesFavorites,
} from '../../../utils/favorites';
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
  if (price === undefined || price === null || price === '') return '$0.00';
  const num = Number(price);
  if (Number.isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
}

function isNoticeFavorite(favorites = [], noticeId) {
  return favorites.some((item) => getFavoriteId(item) === noticeId);
}

const EMPTY_FAVORITES = [];

export default function NoticesItem({
  item,
  onLearnMore,
  onRequireAuth,
  showRemoveFavorite = false,
  variant = 'default',
}) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const favorites = useSelector(
    (state) => state.auth.user?.noticesFavorites ?? EMPTY_FAVORITES,
  );
  const isFavorite = isNoticeFavorite(favorites, item._id);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);

  const image = item.imgURL || item.imgUrl || '';
  const price = formatPrice(item.price);

  const handleRemoveFavorite = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);

    try {
      const data = await removeNoticeFromFavorites(item._id);
      const nextFavorites = favorites.filter(
        (fav) => getFavoriteId(fav) !== item._id,
      );
      dispatch(setNoticesFavorites(resolveNoticesFavorites(data, nextFavorites)));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to remove from favorites',
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    if (favoriteLoading) return;
    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        const data = await removeNoticeFromFavorites(item._id);
        const nextFavorites = favorites.filter(
          (fav) => getFavoriteId(fav) !== item._id,
        );
        dispatch(
          setNoticesFavorites(resolveNoticesFavorites(data, nextFavorites)),
        );
        toast.success('Removed from favorites');
      } else {
        const isFirstFavorite = favorites.length === 0;
        const data = await addNoticeToFavorites(item._id);
        dispatch(
          setNoticesFavorites(
            resolveNoticesFavorites(data, [...favorites, item]),
          ),
        );
        if (isFirstFavorite) {
          setIsCongratsOpen(true);
        } else {
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update favorites',
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <li
      className={`${styles.item} ${
        variant === 'profile' ? styles.profileItem : ''
      }`}
    >
      <img
        className={styles.image}
        src={image}
        alt={item.title}
        loading="lazy"
      />
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <div className={styles.top}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.popularity}>
                <Icon name="star" size={16} className={styles.starIcon} />
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
          </div>
          <p className={styles.comment}>{item.comment}</p>
        </div>

        <div className={styles.footer}>
          <p className={styles.price}>{price}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.learnMore}
              onClick={() => onLearnMore?.(item)}
            >
              Learn more
            </button>
            {showRemoveFavorite ? (
              <button
                type="button"
                className={styles.favorite}
                disabled={favoriteLoading}
                aria-label="Remove from favorites"
                onClick={handleRemoveFavorite}
              >
                <Icon name="trash" size={18} />
              </button>
            ) : variant === 'profile' ? null : (
              <button
                type="button"
                className={`${styles.favorite} ${
                  isFavorite ? styles.favoriteActive : ''
                }`}
                disabled={favoriteLoading}
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
            )}
          </div>
        </div>
      </div>

      <ModalCongrats
        isOpen={isCongratsOpen}
        onClose={() => setIsCongratsOpen(false)}
      />
    </li>
  );
}
