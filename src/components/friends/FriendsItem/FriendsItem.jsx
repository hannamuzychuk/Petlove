import styles from './FriendsItem.module.css';

const getTodayHours = (workDays) => {
  if (!workDays || workDays.length === 0) return 'Day and night';

  const today = new Date().getDay();
  const index = today === 0 ? 6 : today - 1;

  const workDay = workDays[index];
  if (!workDay) return 'Day and night';
  if (!workDay.isOpen) return 'Closed';

  return `${workDay.from} - ${workDay.to}`;
};

export default function FriendsItem({ friend }) {
  return (
    <li className={styles.item}>
      <p className={styles.hours}>{getTodayHours(friend.workDays)}</p>

      <img
        className={styles.logo}
        src={friend.imageUrl}
        alt={friend.title}
      />

      <div className={styles.content}>
        <h3 className={styles.name}>{friend.title}</h3>

        <div className={styles.contacts}>
          <p>
            <span className={styles.label}>Email:</span>{' '}
            {friend.email ? (
              <a href={`mailto:${friend.email}`}>{friend.email}</a>
            ) : (
              '—'
            )}
          </p>

          <p>
            <span className={styles.label}>Address:</span>{' '}
            {friend.addressUrl ? (
              <a
                href={friend.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {friend.address || 'Map'}
              </a>
            ) : (
              friend.address || '—'
            )}
          </p>

          <p>
            <span className={styles.label}>Phone:</span>{' '}
            {friend.phone ? (
              <a href={`tel:${friend.phone}`}>{friend.phone}</a>
            ) : (
              '—'
            )}
          </p>
        </div>
      </div>
    </li>
  );
}
