import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import styles from './Header.module.css';
import Nav from '../Nav/Nav';
import AuthNav from '../AuthNav/AuthNav';
import UserNav from '../UserNav/UserNav';

export default function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { pathname } = useLocation();
  const isAddPet = pathname === '/add-pet';

  return (
    <header className={`${styles.header} ${isAddPet ? styles.addPet : ''}`.trim()}>
      <div className={styles.inner}>
        <Logo />
        <div className={styles.nav}>
          <Nav />
        </div>
        <div className={styles.actions}>
          {isAuthenticated ? <UserNav /> : <AuthNav showFromTablet />}
        </div>
      </div>
    </header>
  );
}
