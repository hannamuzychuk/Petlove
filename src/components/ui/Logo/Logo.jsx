import { Link } from "react-router-dom";
import styles from './Logo.module.css';
import iconStyles from '../Icon/Icon.module.css';
import Icon from '../Icon/Icon';

export default function Logo({ variant = 'dark' }) {
    const isLight = variant === 'light';

    return (
        <Link
          to="/home"
          className={`${styles.logo} ${isLight ? styles.light : ''}`}
          aria-label="PetLove home"
        >
            <span className={styles.text}>petl</span>
            <Icon
            name="heart"
            size={23}
            className={`${iconStyles.heart} ${styles.heart}`}
            />
            <span className={`${styles.text}`}>ve</span>
        </Link>
    );
}