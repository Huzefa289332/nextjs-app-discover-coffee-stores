import Image from 'next/image';
import Link from 'next/link';
import cls from 'classnames';
import styles from '@/components/card.module.css';

const Card = props => {
  return (
    <Link href={props.href} className={styles.cardLink}>
      <div className={cls('glass', styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{props.name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={props.imgUrl}
            width={320}
            height={200}
            alt={props.name}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
