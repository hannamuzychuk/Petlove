import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { logOut } from '../../../redux/authSlice';
import { authPost } from '../../../services/api';
import styles from './ModalApproveAction.module.css';

export default function ModalApproveAction({isOpen, onClose}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleApprove = async () => {
        try {
            await authPost('/users/signout');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Logout failed';
            toast.error(message);
        } finally {
            dispatch(logOut());
            onClose();
            navigate('/home');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.content}>
                <h2 className={styles.title}>Already leaving?</h2>
                <div className={styles.actions}>
                <Button type='button' variant='filled' onClick={handleApprove}>
                        Yes
                    </Button>
                    <Button type='button' variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
}