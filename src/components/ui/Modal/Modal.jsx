import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import Icon from '../Icon/Icon';

export default function Modal({ isOpen, onClose, children }) {
    const modalRef = useRef(null);
    const previouslyFocused = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }

            if (event.key === 'Tab' && modalRef.current) {
                const focusable = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const list = Array.from(focusable);
                if (list.length === 0) return;

                const first = list[0];
                const last = list[list.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        previouslyFocused.current = document.activeElement;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        modalRef.current?.focus?.();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            previouslyFocused.current?.focus?.();
        };
    }, [isOpen, onClose]);


    if(!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true">
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <Icon name="close-menu" size={24} />
                </button>
                {children}
                
            </div>
        </div>
    )
}

