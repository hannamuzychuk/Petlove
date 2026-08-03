import { useState } from 'react';
import styles from './LogOutBtn.module.css';
import ModalApproveAction from '../../ui/ModalApproveAction/ModalApproveAction';

export default function LogOutBtn({ variant = 'default', className }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const label =
    variant === 'soft' || variant === 'filled' ? 'Log out' : 'LOG OUT';

  return (
    <>
      <button
        type="button"
        className={[
          styles.btn,
          variant === 'soft' ? styles.soft : '',
          variant === 'filled' ? styles.filled : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => setIsModalOpen(true)}
      >
        {label}
      </button>

      <ModalApproveAction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
