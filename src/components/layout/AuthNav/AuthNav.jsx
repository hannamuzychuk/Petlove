import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './AuthNav.module.css';

const AUTH_LINKS = [
    { to: '/register', label: 'REGISTRATION' },
    { to: '/login', label: 'LOG IN' },
];

const DRAWER_AUTH_LINKS = [
    { to: '/login', label: 'LOG IN', btnClass: styles.loginBtn },
    { to: '/register', label: 'REGISTRATION', btnClass: styles.registerBtn },
];

export default function AuthNav({ variant = 'dark', inDrawer = false, onClose }) {
    const isLight = variant === 'light';
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return null;
    }

    if (inDrawer) {
        return (
            <div className={styles.drawerAuth}>
                {DRAWER_AUTH_LINKS.map(({ to, label, btnClass }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            [styles.authLink, btnClass, isActive ? styles.active : '']
                                .filter(Boolean)
                                .join(' ')
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        );
    }

    return (
        <nav
            className={`${styles.nav} ${styles.headerOnly}`}
            aria-label="Authentication navigation"
        >
            <ul className={styles.list}>
                {AUTH_LINKS.map(({ to, label }) => (
                    <li key={to} className={styles.item}>
                        <NavLink
                            to={to}
                            className={({ isActive }) =>
                                [
                                    styles.link,
                                    isLight ? styles.linkLight : styles.linkDark,
                                    isActive ? styles.active : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')
                            }
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
