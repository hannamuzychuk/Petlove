import { Outlet, useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
import styles from './MainLayout.module.css';
import Header from '../Header/Header';

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/home';

  return (
    <>
      {!isHome && <Header />}
      <main className={styles.main}>
        <Outlet />
      </main>
      <Loader />
    </>
  );
}
