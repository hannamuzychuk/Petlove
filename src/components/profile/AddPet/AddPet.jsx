import { Link } from 'react-router-dom';
import Icon from '../../ui/Icon/Icon';
import styles from './AddPet.module.css';

export default function AddPet() {
  return (
    <Link to="/add-pet" className={styles.addBtn}>
      Add pet
      <Icon name="plus" size={18} />
    </Link>
  );
}
