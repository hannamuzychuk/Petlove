import { useSelector } from 'react-redux';
import UserBar from '../UserBar/UserBar';
import LogOutBtn from '../LogOutBtn/LogOutBtn';
import styles from './UserNav.module.css';

export default function UserNav({ variant = 'dark', inDrawer = false, onClose }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return null;
    }

    if (inDrawer) {
        return (
            <div className={styles.drawerUser}>
                <LogOutBtn variant="filled" className={styles.drawerLogout} />
            </div>
        );
    }

    return (
        <div className={styles.userNav}>
            <span className={styles.logout}>
                {variant !== 'light' ? <LogOutBtn /> : null}
            </span>
            <UserBar variant={variant} />
        </div>
    );
}
