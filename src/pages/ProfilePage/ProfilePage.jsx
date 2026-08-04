import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Container from '../../components/ui/Container/Container';
import UserCard from '../../components/profile/UserCard/UserCard';
import MyNotices from '../../components/profile/MyNotices/MyNotices';
import ModalEditUser from '../../components/profile/ModalEditUser/ModalEditUser';
import ModalNotice from '../../components/notices/ModalNotice/ModalNotice';
import { fetchCurrentUserFull, deletePet } from '../../services/usersApi';
import { setUserPets } from '../../redux/authSlice';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

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

  const handlePetRemove = async (petId) => {
    try {
      const data = await deletePet(petId);

      if (Array.isArray(data?.pets)) {
        dispatch(setUserPets(data.pets));
      } else if (Array.isArray(data?.user?.pets)) {
        dispatch(setUserPets(data.user.pets));
      } else {
        const nextPets = (user.pets ?? []).filter((pet) => pet._id !== petId);
        dispatch(setUserPets(nextPets));
      }

      toast.success('Pet removed');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to remove pet',
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <div className={styles.layout}>
          <UserCard
            user={user}
            onEdit={() => setIsEditOpen(true)}
            onPetRemove={handlePetRemove}
          />
          <MyNotices
            favorites={user.noticesFavorites ?? []}
            viewed={user.noticesViewed ?? []}
            onLearnMore={setSelectedNotice}
          />
        </div>
      </Container>

      <ModalEditUser
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />

      <ModalNotice
        isOpen={Boolean(selectedNotice)}
        onClose={() => setSelectedNotice(null)}
        notice={selectedNotice}
      />
    </div>
  );
}
