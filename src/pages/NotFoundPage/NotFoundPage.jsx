import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/ui/Container/Container';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  useEffect(() => {
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <section className={styles.panel} aria-labelledby="not-found-title">
          <div className={styles.hero} aria-hidden="true">
            <span className={styles.digit}>4</span>
            <div className={styles.imageWrap}>
              <picture>
                <source
                  media="(min-width: 1280px)"
                  srcSet="/images/desktop_error.jpg 1x, /images/desktop_error@2x.jpg 2x"
                />
                <source
                  media="(min-width: 768px)"
                  srcSet="/images/tablet_error.jpg 1x, /images/tablet_error@2x.jpg 2x"
                />
                <img
                  className={styles.image}
                  src="/images/mobile_error.jpg"
                  srcSet="/images/mobile_error.jpg 1x, /images/mobile_error@2x.jpg 2x"
                  alt=""
                />
              </picture>
            </div>
            <span className={styles.digit}>4</span>
          </div>

          <div className={styles.copy}>
            <h1 id="not-found-title" className={styles.title}>
              Ooops! This page not found :(
            </h1>

            <Link to="/home" className={styles.btn}>
              To home page
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
