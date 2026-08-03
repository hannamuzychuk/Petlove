import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import { logOut } from '../../../redux/authSlice';
import { authPost } from '../../../services/api';
import styles from './ModalApproveAction.module.css';

export default function ModalApproveAction({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleApprove = async () => {
    try {
      await authPost('/users/signout');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Logout failed';
      toast.error(message);
    } finally {
      dispatch(logOut());
      onClose();
      navigate('/home');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.avatar} aria-hidden="true">
          <Icon name="cat" size={44} className={styles.catIcon} />
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>Already leaving?</h2>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.yesBtn}
              onClick={handleApprove}
            >
              Yes
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
