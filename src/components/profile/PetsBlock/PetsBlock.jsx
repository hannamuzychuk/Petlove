import { Link } from 'react-router-dom';
import PetsList from '../PetsList/PetsList';
import Icon from '../../ui/Icon/Icon';
import styles from './PetsBlock.module.css';

export default function PetsBlock({ pets = [], onRemove }) {
  return (
    <section className={styles.block}>
      <div className={styles.header}>
        <h2 className={styles.title}>My pets</h2>
        <Link to="/add-pet" className={styles.addBtn}>
          Add pet
          <Icon name="plus" size={18} />
        </Link>
      </div>
      <PetsList pets={pets} onRemove={onRemove} />
    </section>
  );
}
