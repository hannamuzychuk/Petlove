import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Modal from '../../ui/Modal/Modal';
import Icon from '../../ui/Icon/Icon';
import ModalCongrats from '../../ui/ModalCongrats/ModalCongrats';
import {
  getNoticeById,
  addNoticeToFavorites,
  removeNoticeFromFavorites,
} from '../../../services/noticesApi';
import { setNoticesFavorites } from '../../../redux/authSlice';
import {
  getFavoriteId,
  resolveNoticesFavorites,
} from '../../../utils/favorites';
import styles from './ModalNotice.module.css';

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

function capitalize(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

function isNoticeFavorite(favorites = [], noticeId) {
  return favorites.some((item) => getFavoriteId(item) === noticeId);
}

const EMPTY_FAVORITES = [];

export default function ModalNotice({ isOpen, onClose, notice, onRequireAuth }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const favorites = useSelector(
    (state) => state.auth.user?.noticesFavorites ?? EMPTY_FAVORITES,
  );
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);

  const details =
    fetchedDetails?._id === notice?._id ? fetchedDetails : notice;
  const noticeId = details?._id || notice?._id;
  const isFavorite = isNoticeFavorite(favorites, noticeId);

  useEffect(() => {
    if (!isOpen || !notice?._id || !isAuthenticated) return undefined;

    let cancelled = false;

    const loadDetails = async () => {
      try {
        const data = await getNoticeById(notice._id);
        if (!cancelled) setFetchedDetails(data);
      } catch {
        return;
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [isOpen, notice, isAuthenticated]);

  const image = details?.imgURL || details?.imgUrl || '';
  const popularity = Number(details?.popularity) || 0;
  const filledStars = Math.min(5, popularity > 5 ? 5 : popularity);
  const price = formatPrice(details?.price);
  const category = capitalize(details?.category);
  const email = details?.user?.email;
  const phone = details?.user?.phone;

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    if (!noticeId || favoriteLoading) return;
    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        const data = await removeNoticeFromFavorites(noticeId);
        const nextFavorites = favorites.filter(
          (fav) => getFavoriteId(fav) !== noticeId,
        );
        dispatch(
          setNoticesFavorites(resolveNoticesFavorites(data, nextFavorites)),
        );
        toast.success('Removed from favorites');
      } else {
        const isFirstFavorite = favorites.length === 0;
        const data = await addNoticeToFavorites(noticeId);
        const noticeToStore = details || notice;
        dispatch(
          setNoticesFavorites(
            resolveNoticesFavorites(data, [...favorites, noticeToStore]),
          ),
        );
        if (isFirstFavorite) {
          onClose?.();
          setIsCongratsOpen(true);
        } else {
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update favorites';
      toast.error(message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    if (email) {
      window.location.href = `mailto:${email}`;
      return;
    }

    if (phone) {
      window.location.href = `tel:${phone}`;
      return;
    }

    toast.error('Contact information is not available');
  };

  return (
    <>
      {notice ? (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
          <div className={styles.content}>
            <div className={styles.imageWrap}>
              {image ? (
                <img
                  className={styles.image}
                  src={image}
                  alt={details?.title}
                />
              ) : null}
              {category ? (
                <span className={styles.badge}>{category}</span>
              ) : null}
            </div>

            <div className={styles.heading}>
              <h2 className={styles.title}>{details?.title}</h2>
              <div className={styles.rating}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Icon
                    key={index}
                    name={index < filledStars ? 'star' : 'star-empty'}
                    size={16}
                  />
                ))}
                <span>{popularity}</span>
              </div>
            </div>

            <ul className={styles.meta}>
              <li>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{details?.name}</span>
              </li>
              <li>
                <span className={styles.label}>Birthday</span>
                <span className={styles.value}>
                  {formatDate(details?.birthday)}
                </span>
              </li>
              <li>
                <span className={styles.label}>Sex</span>
                <span className={styles.value}>
                  {capitalize(details?.sex)}
                </span>
              </li>
              <li>
                <span className={styles.label}>Species</span>
                <span className={styles.value}>
                  {capitalize(details?.species)}
                </span>
              </li>
            </ul>

            {details?.comment ? (
              <p className={styles.comment}>{details.comment}</p>
            ) : null}

            <p className={styles.price}>{price}</p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.addBtn}
                onClick={handleFavorite}
                disabled={favoriteLoading}
              >
                {isFavorite ? 'Remove' : 'Add to'}
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  className={styles.heart}
                />
              </button>

              <button
                type="button"
                className={styles.contactBtn}
                onClick={handleContact}
              >
                Contact
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      <ModalCongrats
        isOpen={isCongratsOpen}
        onClose={() => setIsCongratsOpen(false)}
      />
    </>
  );
}
