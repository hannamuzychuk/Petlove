import Modal from '../../ui/Modal/Modal';
import styles from './ModalEditUser.module.css';

export default function ModalEditUser({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>Edit user</h2>
      </div>
    </Modal>
  );
}
