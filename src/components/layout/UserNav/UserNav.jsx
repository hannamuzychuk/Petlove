import { useSelector } from 'react-redux';
import UserBar from '../UserBar/UserBar';
import LogOutBtn from '../LogOutBtn/LogOutBtn';
import styles from './UserNav.module.css';

export default function UserNav({ variant = 'dark' }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.userNav}>
            <UserBar variant={variant} />
            <LogOutBtn />
        </div>
    );
}