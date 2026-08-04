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
  const isAddPet = pathname === '/add-pet';
  const knownRoutes = [
    '/home',
    '/login',
    '/register',
    '/profile',
    '/notices',
    '/news',
    '/friends',
    '/add-pet',
  ];
  const isNotFound = !knownRoutes.includes(pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <main
        className={`${styles.main} ${hideHeader ? styles.mainFull : ''} ${
          isAddPet ? styles.mainAddPet : ''
        } ${isNotFound ? styles.mainNotFound : ''}`.trim()}
      >
        <Outlet />
      </main>
      <Loader />
    </>
  );
}
