import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './Loader.module.css';

const RADIUS = 47;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Loader() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isLoading) {
      setVisible(true);
      setProgress(8);

      const timer = window.setInterval(() => {
        setProgress((current) => {
          if (current >= 92) return current;
          const step = current < 50 ? 6 : current < 75 ? 3 : 1.5;
          return Math.min(92, current + step);
        });
      }, 180);

      return () => window.clearInterval(timer);
    }

    setProgress((current) => (current > 0 ? 100 : 0));
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
      hideTimerRef.current = null;
    }, 280);

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (!visible) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  const label = Math.round(progress);

  return (
    <div
      className={styles.backdrop}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <picture className={styles.picture} aria-hidden="true">
        <source
          media="(min-width: 1280px)"
          srcSet="/images/loader/desktop.webp 1x, /images/loader/desktop@2x.webp 2x"
        />
        <source
          media="(min-width: 768px)"
          srcSet="/images/loader/tablet.webp 1x, /images/loader/tablet@2x.webp 2x"
        />
        <img
          className={styles.image}
          src="/images/loader/mobile.webp"
          srcSet="/images/loader/mobile.webp 1x, /images/loader/mobile@2x.webp 2x"
          alt=""
        />
      </picture>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.progress}>
        <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
          <circle
            className={styles.value}
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={styles.percent}>{label}%</span>
      </div>
    </div>
  );
}
