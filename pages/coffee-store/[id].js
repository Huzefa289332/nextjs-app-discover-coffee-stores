import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/coffee-store.module.css';
import Image from 'next/image';
import cls from 'classnames';
import { fetchCoffeeStores } from '@/lib/coffee-stores';

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores(
    '43.64990206482973,-79.38448035304708',
    'coffee',
    6
  );

  const coffeeStore =
    coffeeStores.find(coffeeStore => coffeeStore.id === params.id) || {};

  return {
    props: { coffeeStore },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores(
    '43.64990206482973,-79.38448035304708',
    'coffee',
    6
  );

  const paths = coffeeStores?.map(coffeeStore => {
    return { params: { id: `${coffeeStore.id}` } };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = props => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { neighbourhood, address, name, imgUrl } = props.coffeeStore;

  const handleUpvoteButton = () => {};

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">&larr; Back to home</Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src={imgUrl}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" />
            <p className={styles.text}>{address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            <p className={styles.text}>{neighbourhood}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>{1}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
