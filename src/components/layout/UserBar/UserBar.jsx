import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import Icon from '../../ui/Icon/Icon';
import styles from './UserBar.module.css';

export default function UserBar({ variant = 'dark' }) {
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return null;
    }

    const isLight = variant === 'light';

    const hasAvatar = Boolean(user?.avatar);
    const displayName = user?.name || 'User';

    return (
        <div className={styles.userBar}>
            <Link
             to="/profile" 
             className={`${styles.userLink} ${isLight ? styles.profileLinkLight : styles.profileLinkDark}`}
             >
            <span className={styles.avatar}>
                {hasAvatar ? (
                    <img
                     src={user.avatar}
                      alt={displayName}
                      className={styles.avatarImage}
                    />
                ) :  (
               <span className={styles.avatarFallback}>
                <Icon name="user" size={24} className={styles.avatarIcon}/>
               </span>
                )}
            </span>
            <span className={styles.name}>{displayName}</span>
            </Link>

        </div>
    )
}

