import Title from '../../components/ui/Title/Title';
import PetBlock from '../../components/ui/PetBlock/PetBlock';
import RegistrationForm from '../../components/auth/RegistrationForm/RegistrationForm';
import Logo from '../../components/ui/Logo/Logo';
import Nav from '../../components/layout/Nav/Nav';
import AuthNav from '../../components/layout/AuthNav/AuthNav';
import Icon from '../../components/ui/Icon/Icon';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <Logo />
        <div className={styles.topNav}>
          <Nav menuTheme="accent" />
        </div>
        <div className={styles.topActions}>
          <AuthNav showFromTablet />
        </div>
      </header>

      <div className={styles.petWrap}>
        <PetBlock
          className={styles.petBlock}
          mobile="/images/mobile-register.webp"
          mobile2x="/images/mobile-register@2x.webp"
          tablet="/images/tablet_register.webp"
          tablet2x="/images/tablet_register@2x.webp"
          desktop="/images/desktop_register.webp"
          desktop2x="/images/desktop_register@2x.webp"
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
