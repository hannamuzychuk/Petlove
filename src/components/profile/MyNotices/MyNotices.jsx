import { useState } from 'react';
import NoticesList from '../../notices/NoticesList/NoticesList';
import styles from './MyNotices.module.css';

export default function MyNotices({
  favorites = [],
  viewed = [],
  onLearnMore,
}) {
  const [tab, setTab] = useState('favorites');
  const isFavorites = tab === 'favorites';
  const items = isFavorites ? favorites : viewed;

  return (
    <section className={styles.section}>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={isFavorites}
          className={`${styles.tab} ${isFavorites ? styles.active : ''}`}
          onClick={() => setTab('favorites')}
        >
          My favorite pets
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isFavorites}
          className={`${styles.tab} ${!isFavorites ? styles.active : ''}`}
          onClick={() => setTab('viewed')}
        >
          Viewed
        </button>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>
          {isFavorites
            ? "Oops, looks like there aren't any furries on your favorite list yet. Do not worry! View your pets now and let them fill this space with joy."
            : "You haven't viewed any notices yet."}
        </p>
      ) : (
        <NoticesList
          items={items}
          onLearnMore={onLearnMore}
          showRemoveFavorite={isFavorites}
          variant="profile"
        />
      )}
    </section>
  );
}
