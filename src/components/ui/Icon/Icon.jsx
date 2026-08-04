import styles from './Icon.module.css';

export default function Icon({
  name,
  size = 18,
  width,
  height,
  className = '',
}) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={w}
      height={h}
      aria-hidden="true"
    >
      <use href={`/sprite.svg#${name}`} fill="currentColor" />
    </svg>
  );
}
