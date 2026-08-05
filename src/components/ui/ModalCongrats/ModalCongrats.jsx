import { Link } from 'react-router-dom';

import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import styles from './ModalCongrats.module.css';

export default function ModalCongrats({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          <Icon name="cat" size={44} />
        </div>

        <div className={styles.body}>
          <div className={styles.text}>
            <h2 className={styles.title}>Congrats</h2>
            <p className={styles.description}>
              The first fluff in the favorites! May your friendship be the
              happiest and filled with fun.
            </p>
          </div>

          <Link to="/profile" className={styles.button} onClick={onClose}>
            Go to profile
          </Link>
        </div>
      </div>
    </Modal>
  );
}
