import styles from './PetBlock.module.css';

export default function PetBlock({
  mobile,
  mobile2x,
  tablet,
  tablet2x,
  desktop,
  desktop2x,
  alt = 'Pet photo',
  className = '',
}) {
  return (
    <div className={`${styles.block} ${className}`.trim()}>
      <picture>
        <source
          media="(min-width: 1280px)"
          srcSet={`${desktop} 1x, ${desktop2x} 2x`}
        />
        <source
          media="(min-width: 768px)"
          srcSet={`${tablet} 1x, ${tablet2x} 2x`}
        />
        <img
          className={styles.image}
          src={mobile}
          srcSet={`${mobile} 1x, ${mobile2x} 2x`}
          alt={alt}
          loading="lazy"
        />
      </picture>
    </div>
  );
}
