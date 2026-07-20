import { useSelector } from 'react-redux';
import Logo from '../../ui/Logo/Logo';
import styles from './Header.module.css';
import Nav from '../Nav/Nav';
import AuthNav from '../AuthNav/AuthNav';
import UserNav from '../UserNav/UserNav';

export default function Header() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <header className={styles.header}>
            <Logo />
            <div className={styles.nav}>
                <Nav />
            </div>
            {isAuthenticated ? <UserNav /> : <AuthNav />}
        </header>
    );
}
