import EditUserBtn from '../EditUserBtn/EditUserBtn';
import UserBlock from '../UserBlock/UserBlock';
import PetsBlock from '../PetsBlock/PetsBlock';
import LogOutBtn from '../../layout/LogOutBtn/LogOutBtn';
import Icon from '../../ui/Icon/Icon';
import styles from './UserCard.module.css';

export default function UserCard({ user, onEdit, onPetRemove }) {
  return (
    <aside className={styles.card}>
      <span className={styles.badge}>
        User
        <Icon name="user" size={18} />
      </span>
      <EditUserBtn onClick={onEdit} />
      <UserBlock user={user} onEdit={onEdit} />
      <PetsBlock pets={user?.pets ?? []} onRemove={onPetRemove} />
      <div className={styles.logout}>
        <LogOutBtn variant="soft" />
      </div>
    </aside>
  );
}
