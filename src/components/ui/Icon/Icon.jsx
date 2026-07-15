import styles from './Icon.module.css';

export default function Icon({ name, size = 18, className = '' }) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
