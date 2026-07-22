import { useSelector } from 'react-redux';
import Button from '../../ui/Button/Button';
import styles from './AuthNav.module.css';

export default function AuthNav({ variant = 'dark', inDrawer = false, onClose }) {
  const isLight = variant === 'light';
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return null;
  }

  if (inDrawer) {
    return (
      <div className={styles.drawerAuth}>
        <Button
          to="/login"
          variant="filled"
          onClick={onClose}
          className={styles.loginBtn}
        >
          LOG IN
        </Button>
        <Button
          to="/register"
          variant="soft"
          onClick={onClose}
          className={styles.registerBtn}
        >
          REGISTRATION
        </Button>
      </div>
    );
  }

  return (
    <nav
      className={`${styles.nav} ${styles.headerOnly}`}
      aria-label="Authentication navigation"
    >
      <ul className={styles.list}>
        <li className={styles.item}>
          <Button
            to="/login"
            variant={isLight ? 'outlineLight' : 'filled'}
            className={styles.headerLogin}
          >
            Log In
          </Button>
        </li>
        <li className={styles.item}>
          <Button
            to="/register"
            variant={isLight ? 'filledLight' : 'soft'}
            className={styles.headerRegister}
          >
            Registration
          </Button>
        </li>
      </ul>
    </nav>
  );
}
