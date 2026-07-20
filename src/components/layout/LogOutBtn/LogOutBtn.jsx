import { useDispatch } from 'react-redux';
import { logOut } from '../../../redux/authSlice';
import styles from './LogOutBtn.module.css';

export default function LogOutBtn() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logOut());
    };

    return (
        <button type="button" className={styles.btn} onClick={handleLogout}>
            LOG OUT
        </button>
    );
}