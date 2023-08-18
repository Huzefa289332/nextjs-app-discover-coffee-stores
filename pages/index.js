import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner';
import Image from 'next/image';
import Card from '@/components/card';
import coffeeStoresData from '@/data/coffee-stores.json';

export async function getStaticProps() {
  return {
    props: { coffeeStores: coffeeStoresData },
  };
}

export default function Home(props) {
  const handleOnBannerButtonClick = () => {
    console.log('Click');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerButtonClick}
        />

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Sitting on confortable chair with a cup of coffee in hand"
          />
        </div>

        <div className={styles.sectionWrapper}>
          {(props.coffeeStores?.length || null) && (
            <>
              <h2 className={styles.heading2}>Toronto stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores?.map(coffeeStore => {
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
