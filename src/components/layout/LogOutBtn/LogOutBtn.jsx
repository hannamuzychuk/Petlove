import { useState } from 'react';
import styles from './LogOutBtn.module.css';
import ModalApproveAction from '../../ui/ModalApproveAction/ModalApproveAction';

export default function LogOutBtn({ variant = 'default' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`${styles.btn} ${variant === 'soft' ? styles.soft : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        {variant === 'soft' ? 'Log out' : 'LOG OUT'}
      </button>

      <ModalApproveAction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
