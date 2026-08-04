import Title from '../../components/ui/Title/Title';
import PetBlock from '../../components/ui/PetBlock/PetBlock';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import Logo from '../../components/ui/Logo/Logo';
import Nav from '../../components/layout/Nav/Nav';
import AuthNav from '../../components/layout/AuthNav/AuthNav';
import Icon from '../../components/ui/Icon/Icon';
import styles from './LoginPage.module.css';

export default function LoginPage() {
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
          mobile="/images/auth/mobile_login.webp"
          mobile2x="/images/auth/mobile_login@2x.webp"
          tablet="/images/auth/tablet_login.webp"
          tablet2x="/images/tablet_login@2x.webp"
          desktop="/images/desktop_login.webp"
          desktop2x="/images/desktop_login@2x.webp"
          alt="Dog photo for login page"
        />
        <aside className={styles.petCard} aria-hidden="true">
          <div className={styles.petAvatar}>
            <Icon name="dog" size={32} />
          </div>
          <div className={styles.petInfo}>
            <div className={styles.petMeta}>
              <p className={styles.petName}>Rich</p>
              <p className={styles.petBirthday}>
                <span>Birthday:</span> 21.09.2020
              </p>
            </div>
            <p className={styles.petDesc}>
              Rich would be the perfect addition to an active family that loves
              to play and go on walks. I bet he would love having a doggy
              playmate too!
            </p>
          </div>
        </aside>
      </div>

      <div className={styles.content}>
        <div className={styles.formWrap}>
          <div className={styles.intro}>
            <Title className={styles.title}>Log in</Title>
            <p className={styles.text}>
              Welcome! Please enter your credentials to login to the platform:
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
