import { Outlet, useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
import styles from './MainLayout.module.css';
import Header from '../Header/Header';

export default function MainLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const hideHeader =
    pathname === '/home' ||
    pathname === '/login' ||
    pathname === '/register';

  return (
    <>
      {!hideHeader && <Header />}
      <main className={`${styles.main} ${hideHeader ? styles.mainFull : ''}`}>
        <Outlet />
      </main>
      <Loader />
    </>
  );
}
