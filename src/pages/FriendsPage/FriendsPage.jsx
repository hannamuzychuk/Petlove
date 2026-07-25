import { useState, useEffect } from 'react';
import { fetchFriends } from '../../services/friendsApi';
import toast from 'react-hot-toast';
import FriendsList from '../../components/friends/FriendsList/FriendsList';
import Title from '../../components/ui/Title/Title';
import Container from '../../components/ui/Container/Container';
import styles from './FriendsPage.module.css';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await fetchFriends();
        setFriends(data);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to load friends';
        toast.error(message);
      }
    };

    loadFriends();
  }, []);

  return (
    <div className={styles.page}>
      <Container>
        <Title>Our friends</Title>
        <FriendsList friends={friends} />
      </Container>
    </div>
  );
}
