import Title from '../../components/ui/Title/Title';
import PetBlock from '../../components/ui/PetBlock/PetBlock';
import RegistrationForm from '../../components/auth/RegistrationForm/RegistrationForm';
import Icon from '../../components/ui/Icon/Icon';
import Logo from '../../components/ui/Logo/Logo';
import Nav from '../../components/layout/Nav/Nav';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <Logo />
        <Nav menuTheme="accent" />
      </header>

      <div className={styles.petWrap}>
        <PetBlock
          className={styles.petBlock}
          mobile="/images/auth/mobile-registration.webp"
          mobile2x="/images/auth/mobile-registration@2x.webp"
          tablet="/images/auth/tablet-registration.webp"
          tablet2x="/images/auth/tablet-registration@2x.webp"
          desktop="/images/auth/desktop-registration.webp"
          desktop2x="/images/auth/desktop-registration@2x.webp"
          alt="Cat photo for register page"
        />
        <aside className={styles.petCard} aria-hidden="true">
          <div className={styles.petAvatar}>
            <Icon name="cat" size={32} />
          </div>
          <div className={styles.petInfo}>
            <div className={styles.petMeta}>
              <p className={styles.petName}>Jack</p>
              <p className={styles.petBirthday}>
                <span>Birthday:</span> 18.10.2021
              </p>
            </div>
            <p className={styles.petDesc}>
              Jack is a gray Persian cat with green eyes. He loves to be
              pampered and groomed, and enjoys playing with toys.
            </p>
          </div>
        </aside>
      </div>

      <div className={styles.content}>
        <div className={styles.formWrap}>
          <div className={styles.intro}>
            <Title className={styles.title}>Registration</Title>
            <p className={styles.text}>
              Thank you for your interest in our platform.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
