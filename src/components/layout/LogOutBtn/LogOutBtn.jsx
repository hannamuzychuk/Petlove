import { useState } from 'react';
import styles from './LogOutBtn.module.css';
import ModalApproveAction from '../../ui/ModalApproveAction/ModalApproveAction';

export default function LogOutBtn() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <>
        <button type="button" className={styles.btn} onClick={() => setIsModalOpen(true)}>
            LOG OUT
        </button>

        <ModalApproveAction isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
}