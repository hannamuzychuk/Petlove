import PetBlock from '../../components/ui/PetBlock/PetBlock';
import AddPetForm from '../../components/pets/AddPetForm/AddPetForm';
import styles from './AddPetPage.module.css';

export default function AddPetPage() {
  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.petWrap}>
          <PetBlock
            className={styles.petBlock}
            mobile="/images/auth/mobile_login.webp"
            mobile2x="/images/auth/mobile_login@2x.webp"
            tablet="/images/auth/tablet-login.webp"
            tablet2x="/images/auth/tablet-login@2x.webp"
            desktop="/images/auth/desktop-login.webp"
            desktop2x="/images/auth/desktop-login@2x.webp"
            alt="Dog wearing yellow glasses"
          />
        </div>

        <div className={styles.content}>
          <AddPetForm />
        </div>
      </div>
    </div>
  );
}
