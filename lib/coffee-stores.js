import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getListOfCoffeeStorePhotos = async () => {
  try {
    const photos = await unsplash.search.getPhotos({
      query: 'coffee shop',
      page: 1,
      perPage: 30,
    });

    const unsplashResults = photos.response.results;

    return unsplashResults.map(result => result.urls.small);
  } catch (error) {
    console.log(error);
  }
};

export const fetchCoffeeStores = async (ll, query, limit) => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const searchParams = new URLSearchParams({ query, ll, limit });

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?${searchParams}`,
    options
  );

  const data = await response.json();

  return data.results.map(result => {
    return {
      id: result.fsq_id,
      address: result.location.formatted_address,
      neighbourhood: result.location.cross_street,
      name: result.name,
      imgUrl: photos[Math.round(Math.random() * 31)],
    };
  });
};
