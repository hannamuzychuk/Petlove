import Logo from '../../ui/Logo/Logo';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <Logo />
        </header>
    )
}