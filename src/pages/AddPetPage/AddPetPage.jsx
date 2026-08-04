import { useEffect } from 'react';

import Container from '../../components/ui/Container/Container';
import PetBlock from '../../components/ui/PetBlock/PetBlock';
import AddPetForm from '../../components/pets/AddPetForm/AddPetForm';
import styles from './AddPetPage.module.css';

export default function AddPetPage() {
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
        <div className={styles.layout}>
          <div className={styles.petWrap}>
            <PetBlock
              className={styles.petBlock}
              mobile="/images/mobile_add_pet.jpg"
              mobile2x="/images/mobile_add_pet@2x.jpg"
              tablet="/images/tablet_add_pet.jpg"
              tablet2x="/images/tablet_add_pet@2x.jpg"
              desktop="/images/desktop_add_pet.jpg"
              desktop2x="/images/desktop_add_pet@2x.jpg"
              alt="Dog wearing yellow glasses"
            />
          </div>

          <div className={styles.content}>
            <AddPetForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
