import { useEffect, useState } from 'react';

import Icon from '../Icon/Icon';
import styles from './Pagination.module.css';

function getPageItems(page, totalPages, compact) {
  const maxVisible = compact ? 3 : 4;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (compact) {
    if (page <= 2) return [1, 2, 'ellipsis'];
    if (page >= totalPages - 1) {
      return ['ellipsis', totalPages - 1, totalPages];
    }
    return ['ellipsis', page, 'ellipsis'];
  }

  if (page <= 2) return [1, 2, 3, 'ellipsis'];
  if (page >= totalPages - 1) {
    return ['ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }

  return ['ellipsis', page - 1, page, page + 1, 'ellipsis'];
}

export default function Pagination({ page, totalPages, onChange }) {
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setCompact(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (!totalPages || totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  const items = getPageItems(page, totalPages, compact);
  const iconSize = compact ? 20 : 24;

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <div className={styles.group}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onChange(1)}
          disabled={isFirst}
          aria-label="First page"
        >
          <span className={styles.double}>
            <Icon name="vector-left" size={iconSize} />
            <Icon name="left-second" size={iconSize} />
          </span>
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={() => onChange(page - 1)}
          disabled={isFirst}
          aria-label="Previous page"
        >
          <Icon name="vector-left" size={iconSize} />
        </button>
      </div>

      <div className={styles.pages}>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`e-${index}`} className={styles.ellipsis} aria-hidden>
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${styles.page} ${page === item ? styles.active : ''}`}
              onClick={() => onChange(item)}
              aria-label={`Page ${item}`}
              aria-current={page === item ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className={styles.group}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onChange(page + 1)}
          disabled={isLast}
          aria-label="Next page"
        >
          <Icon name="vector-right" size={iconSize} />
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={() => onChange(totalPages)}
          disabled={isLast}
          aria-label="Last page"
        >
          <span className={styles.double}>
            <Icon name="vector-right" size={iconSize} />
            <Icon name="vector-right-second" size={iconSize} />
          </span>
        </button>
      </div>
    </nav>
  );
}
