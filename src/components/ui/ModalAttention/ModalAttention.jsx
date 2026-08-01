import { Link } from 'react-router-dom';

import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import styles from './ModalAttention.module.css';

export default function ModalAttention({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          <Icon name="dog" size={44} />
        </div>

        <div className={styles.text}>
          <h2 className={styles.title}>Attention</h2>
          <p className={styles.description}>
            We would like to remind you that certain functionality is available
            only to authorized users.If you have an account, please log in with
            your credentials. If you do not already have an account, you must
            register to access these features.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/login" className={styles.login} onClick={onClose}>
            Log In
          </Link>
          <Link to="/register" className={styles.register} onClick={onClose}>
            Registration
          </Link>
        </div>
      </div>
    </Modal>
  );
}
