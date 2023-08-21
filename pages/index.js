import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner';
import Image from 'next/image';
import Card from '@/components/card';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import useTrackLocation from '@/hooks/use-track-location';
import { useEffect, useState } from 'react';

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores(
    '43.64990206482973,-79.38448035304708',
    'coffee',
    6
  );

  return {
    props: { coffeeStores },
  };
}

export default function Home(props) {
  const [coffeeStores, setCoffeeStores] = useState([]);
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { handleTrackLocation, latLng, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    (async () => {
      if (latLng) {
        console.log({ latLng });
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(
            latLng,
            'coffee',
            30
          );
          setCoffeeStores(fetchedCoffeeStores);
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    })();
  }, [latLng]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerButtonClick}
        />

        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Sitting on confortable chair with a cup of coffee in hand"
          />
        </div>

        {(coffeeStores.length || null) && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl}
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}

        {(props.coffeeStores?.length || null) && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl}
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
