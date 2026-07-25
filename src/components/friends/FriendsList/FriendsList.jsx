import FriendsItem from '../FriendsItem/FriendsItem';
import styles from './FriendsList.module.css';

export default function FriendsList({ friends }) {
    return (
        <ul className={styles.list}>
            {friends.map((friend) => (
                <FriendsItem key={friend._id} friend={friend} />
            ))}
        </ul>
    )
}