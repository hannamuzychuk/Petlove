import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Nav.module.css';
import Icon from '../../ui/Icon/Icon';
import AuthNav from '../AuthNav/AuthNav';
import UserNav from '../UserNav/UserNav';

const NAV_LINKS = [
    { to: '/news', label: 'News' },
    { to: '/notices', label: 'Find pet' },
    { to: '/friends', label: 'Our friends' },
];

export default function Nav({ variant = 'dark', menuTheme = 'default' }) {
    const isLight = variant === 'light';
    const isAccentMenu = menuTheme === 'accent';
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const closeMenu = () => setIsOpen(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);

    const renderLinks = (isDrawerMenu) => (
        NAV_LINKS.map(({ to, label }) => (
            <li key={to} className={styles.item}>
                <NavLink
                    to={to}
                    onClick={isDrawerMenu ? closeMenu : undefined}
                    className={({ isActive }) =>
                        [
                            styles.link,
                            isDrawerMenu && isAccentMenu
                                ? styles.linkAccent
                                : isDrawerMenu || !isLight
                                  ? styles.linkDark
                                  : styles.linkLight,
                            isActive ? styles.active : '',
                        ]
                            .filter(Boolean)
                            .join(' ')
                    }
                >
                    {label}
                </NavLink>
            </li>
        ))
    );

    return (
        <>
            <button
                type="button"
                className={`${styles.burger} ${isLight ? styles.burgerLight : styles.burgerDark} ${isOpen ? styles.burgerHidden : ''}`}
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
                <Icon name="burger-menu" size={32} />
            </button>

            {isOpen && (
                <>
                    <div
                        className={styles.menuOverlay}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />
                    <div
                        className={`${styles.menuPanel} ${isAccentMenu ? styles.menuPanelAccent : ''}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                    >
                        <button
                            type="button"
                            className={`${styles.closeBtn} ${isAccentMenu ? styles.closeBtnAccent : ''}`}
                            onClick={closeMenu}
                            aria-label="Close menu"
                        >
                            <Icon name="close-menu" size={32} />
                        </button>

                        <nav
                            className={`${styles.nav} ${styles.menu}`}
                            aria-label="Main navigation"
                        >
                            <ul className={styles.list}>{renderLinks(true)}</ul>
                        </nav>

                        {isAuthenticated ? (
                            <UserNav inDrawer onClose={closeMenu} />
                        ) : (
                            <AuthNav
                              inDrawer
                              onClose={closeMenu}
                              menuTheme={menuTheme}
                            />
                        )}
                    </div>
                </>
            )}

            <nav
                className={`${styles.nav} ${styles.desktopNav}`}
                aria-label="Main navigation"
            >
                <ul className={styles.list}>{renderLinks(false)}</ul>
            </nav>
        </>
    );
}
