import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Container from '../../components/ui/Container/Container';
import UserCard from '../../components/profile/UserCard/UserCard';
import MyNotices from '../../components/profile/MyNotices/MyNotices';
import ModalEditUser from '../../components/profile/ModalEditUser/ModalEditUser';
import { fetchCurrentUserFull } from '../../services/usersApi';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchCurrentUserFull(dispatch);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to load profile',
        );
      }
    };

    load();
  }, [dispatch]);

  const handlePetRemove = () => {};

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <UserCard
            user={user}
            onEdit={() => setIsEditOpen(true)}
            onPetRemove={handlePetRemove}
          />
          <MyNotices
            favorites={user.noticesFavorites ?? []}
            viewed={user.noticesViewed ?? []}
          />
        </div>
      </Container>

      <ModalEditUser
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />
    </div>
  );
}
