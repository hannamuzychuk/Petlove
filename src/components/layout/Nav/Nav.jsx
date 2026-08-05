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
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isMounted) return undefined;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsOpen(true));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isMounted]);

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

  const openMenu = () => {
    setIsMounted(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isMounted) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted]);

  const toggleMenu = () => {
    if (isOpen || isMounted) {
      closeMenu();
      return;
    }
    openMenu();
  };

  const handlePanelTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== 'transform') return;
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  const renderLinks = (isDrawerMenu) =>
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
    ));

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

      {isMounted ? (
        <>
          <div
            className={`${styles.menuOverlay} ${isOpen ? styles.menuOverlayOpen : ''}`}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className={`${styles.menuPanel} ${isAccentMenu ? styles.menuPanelAccent : ''} ${isOpen ? styles.menuPanelOpen : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onTransitionEnd={handlePanelTransitionEnd}
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
              className={`${styles.nav} ${styles.menu} ${isOpen ? styles.menuContentOpen : ''}`}
              aria-label="Main navigation"
            >
              <ul className={styles.list}>{renderLinks(true)}</ul>
            </nav>

            <div
              className={`${styles.drawerActions} ${isOpen ? styles.menuContentOpen : ''}`}
            >
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
          </div>
        </>
      ) : null}

      <nav
        className={`${styles.nav} ${styles.desktopNav}`}
        aria-label="Main navigation"
      >
        <ul className={styles.list}>{renderLinks(false)}</ul>
      </nav>
    </>
  );
}
