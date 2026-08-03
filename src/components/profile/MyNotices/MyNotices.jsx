import { useState } from 'react';
import styles from './MyNotices.module.css';

export default function MyNotices({ favorites = [], viewed = [] }) {
  const [tab, setTab] = useState('favorites');
  const items = tab === 'favorites' ? favorites : viewed;

  return (
    <section className={styles.section}>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'favorites'}
          className={`${styles.tab} ${tab === 'favorites' ? styles.active : ''}`}
          onClick={() => setTab('favorites')}
        >
          My favorite pets
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'viewed'}
          className={`${styles.tab} ${tab === 'viewed' ? styles.active : ''}`}
          onClick={() => setTab('viewed')}
        >
          Viewed
        </button>
      </div>

      <p className={styles.summary}>
        {tab === 'favorites' ? 'My favorite pets' : 'Viewed'}: {items.length}
      </p>
    </section>
  );
}
