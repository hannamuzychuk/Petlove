import PetsItem from '../PetsItem/PetsItem';
import styles from './PetsList.module.css';

export default function PetsList({ pets = [], onRemove }) {
  if (!pets.length) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {pets.map((pet) => (
        <PetsItem key={pet._id} pet={pet} onRemove={onRemove} />
      ))}
    </ul>
  );
}
