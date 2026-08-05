import Logo from '../../components/ui/Logo/Logo';
import styles from './HomePage.module.css';
import Nav from '../../components/layout/Nav/Nav';
import AuthNav from '../../components/layout/AuthNav/AuthNav';
import UserNav from '../../components/layout/UserNav/UserNav'; 
import { useSelector } from 'react-redux';
import Container from '../../components/ui/Container/Container';

export default function HomePage() {

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  return (
    <Container className={styles.page}>
      <section className={styles.hero}>
        <header className={styles.heroHeader}>
          <Logo variant="light" />
          <div className={styles.heroNav}>
            <Nav variant="light" />
          </div>
          <div className={styles.heroActions}>
            {isAuthenticated
              ? <UserNav variant="light" />
              : <AuthNav variant="light" showFromTablet />}
          </div>
        </header>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Take good <span className={styles.titleAccent}>care</span> of your
            small pets
          </h1>
          <p className={styles.description}>
            Choosing a pet for your home is a choice that is meant to enrich
            your life with immeasurable joy and tenderness.
          </p>
        </div>
      </section>

      <section className={styles.media}>
        <picture className={styles.picture}>
          <source
            media="(min-width: 1280px)"
            srcSet="/images/home_desktop@1x.webp 1x, /images/home_desktop@2x.webp 2x"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/images/home_tablet@1x.webp 1x, /images/home_tablet@2x.webp 2x"
          />
          <img
            className={styles.image}
            src="/images/home_mobile@1x.webp"
            srcSet="/images/home_mobile@1x.webp 1x, /images/home_mobile@2x.webp 2x"
            alt="Woman hugging her dog"
            fetchPriority="high"
            decoding="async"
            width={335}
            height={402}
          />
        </picture>
      </section>
    </Container>
  );
}
