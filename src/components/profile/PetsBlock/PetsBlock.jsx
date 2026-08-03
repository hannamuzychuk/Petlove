import AddPet from '../AddPet/AddPet';
import PetsList from '../PetsList/PetsList';
import styles from './PetsBlock.module.css';

export default function PetsBlock({ pets = [], onRemove }) {
  return (
    <section className={styles.block}>
      <div className={styles.header}>
        <h2 className={styles.title}>My pets</h2>
        <AddPet />
      </div>
      <PetsList pets={pets} onRemove={onRemove} />
    </section>
  );
}
