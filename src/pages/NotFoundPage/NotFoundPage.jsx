import { Link } from 'react-router-dom';
import Container from '../../components/ui/Container/Container';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <Container>
        <section className={styles.panel} aria-labelledby="not-found-title">
          <div className={styles.hero} aria-hidden="true">
            <span className={styles.digit}>4</span>
            <div className={styles.imageWrap}>
              <img
                className={styles.image}
                src="/images/404.webp"
                srcSet="/images/404.webp 1x, /images/404@2x.webp 2x"
                alt=""
              />
            </div>
            <span className={styles.digit}>4</span>
          </div>

          <h1 id="not-found-title" className={styles.title}>
            Ooops! This page not found :(
          </h1>

          <Link to="/home" className={styles.btn}>
            To home page
          </Link>
        </section>
      </Container>
    </div>
  );
}
