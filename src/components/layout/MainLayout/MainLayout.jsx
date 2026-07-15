import { Outlet } from 'react-router-dom';
import Loader from '../Loader/Loader';
import styles from './MainLayout.module.css';
import Header from '../Header/Header';

export default function MainLayout() {
    return (
        <>
        <Header />
        <main className={styles.main}>
            <Outlet />
        </main>

            <Loader />
        </>
    );
}

