import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/coffee-store.module.css';
import Image from 'next/image';
import cls from 'classnames';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StoreContext } from '@/store/store-context';
import useSWR from 'swr';

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

const CoffeeStore = initialProps => {
  const router = useRouter();

  const {
    state: { coffeeStores: coffeeStoresFromContext },
  } = useContext(StoreContext);

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const coffeeStoreFromStaticProps = useMemo(
    () => initialProps.coffeeStore || {},
    [initialProps]
  );

  const [votingCount, setVotingCount] = useState(0);

  const id = router.query.id;

  const { data, error, isLoading } = useSWR(
    `/api/getCoffeeStoreById?id=${id}`,
    url => fetch(url).then(r => r.json())
  );

  useEffect(() => {
    setVotingCount(data?.[0]?.voting || 0);
    setCoffeeStore(data?.[0] || {});
  }, [data]);

  const handleCreateCoffeeStore = useCallback(async coffeeStore => {
    try {
      await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...coffeeStore, voting: 0 }),
      });
    } catch (error) {
      console.log('handleCreateCoffeeStore ==> ', error);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(coffeeStoreFromStaticProps).length) {
      handleCreateCoffeeStore(coffeeStoreFromStaticProps);
      return;
    }

    if (!coffeeStoresFromContext.length) return;

    const coffeeStoreFromContext = coffeeStoresFromContext.find(
      coffeeStoreFromContext => coffeeStoreFromContext.id === id
    );

    if (!coffeeStoreFromContext) return;

    setCoffeeStore(coffeeStoreFromContext);
    handleCreateCoffeeStore(coffeeStoreFromContext);
  }, [
    id,
    coffeeStoresFromContext,
    coffeeStoreFromStaticProps,
    handleCreateCoffeeStore,
  ]);

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const stores = await response.json();

      if (stores.length) {
        setVotingCount(state => state + 1);
      }
    } catch (error) {
      console.log('handleUpvoteButton ==> ', error);
    }
  };

  const { neighbourhood, address, name, imgUrl } = coffeeStore;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

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
            src={imgUrl || '/static/placeholder.jpg'}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name || 'store image'}
            priority={true}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              alt="places icon"
              src="/static/icons/places.svg"
              width="24"
              height="24"
            />
            <p className={styles.text}>{address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              alt="near me icon"
              src="/static/icons/nearMe.svg"
              width="24"
              height="24"
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              alt="star icon"
              src="/static/icons/star.svg"
              width="24"
              height="24"
            />
            <p className={styles.text}>{votingCount}</p>
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
