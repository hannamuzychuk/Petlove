import { useSelector } from 'react-redux';
import styles from './Loader.module.css';

export default function Loader(){
    const isLoading = useSelector(state => state.loading.isLoading);
    if(!isLoading) {
        return null;
    }

    return (
        <div className={styles.backdrop} role='status' aria-live='polite' aria-label='Loading...'>
            <div className={styles.spinner}></div>
        </div>
    );
}