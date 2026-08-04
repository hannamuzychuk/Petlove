import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ variant = 'dark' }) {
  const isLight = variant === 'light';
  const heartFill = isLight ? '#ffffff' : '#f6b83d';

  return (
    <Link
      to="/home"
      className={`${styles.logo} ${isLight ? styles.light : ''}`}
      aria-label="PetLove home"
    >
      <span className={styles.text}>petl</span>
      <svg
        className={styles.heart}
        width="17"
        height="17"
        viewBox="0 0 23 23"
        fill="none"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.4935 5.43447C9.6541 3.26268 6.58677 2.67848 4.28212 4.66718C1.97748 6.65589 1.65302 9.98091 3.46287 12.333C4.62209 13.8395 7.59088 16.6331 9.5756 18.447C10.2351 19.0498 10.5649 19.3512 10.9599 19.4721C11.2995 19.576 11.6875 19.576 12.0271 19.4721C12.4221 19.3512 12.7519 19.0498 13.4114 18.447C15.3961 16.6331 18.3649 13.8395 19.5241 12.333C21.334 9.98091 21.0491 6.63497 18.7049 4.66718C16.3606 2.6994 13.3329 3.26268 11.4935 5.43447Z"
          fill={heartFill}
        />
      </svg>
      <span className={styles.text}>ve</span>
    </Link>
  );
}
