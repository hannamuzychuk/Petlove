import styles from './NewsItem.module.css';

function formatData(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default function NewsItem({ item}) {
    return (
        <li className={styles.item}>
            <img 
               src={item.imgUrl}
               alt={item.title}
               className={styles.image}
               loading="lazy"
            />

            <div className={styles.body}>
                <div className={styles.Block}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.text}>{item.text}</p>
                </div>

                <div className={styles.footer}>
                    <time className={styles.data} datetime={item.date}>
                        {formatData(item.date)}
                    </time>

                    <a
                     className={styles.link}
                     href={item.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="Read more"
                     >
                        Read more
                     </a>
                </div>
            </div>
        </li>
    )
}