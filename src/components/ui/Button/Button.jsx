import { Link } from 'react-router-dom';
import styles from './Button.module.css';

const VARIANT_CLASS = {
  filled: styles.filled,
  outline: styles.outline,
  outlineLight: styles.outlineLight,
  filledLight: styles.filledLight,
  soft: styles.soft,
};

export default function Button({
  children,
  type = 'button',
  variant = 'filled',
  to,
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    styles.btn,
    VARIANT_CLASS[variant] || styles.filled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
