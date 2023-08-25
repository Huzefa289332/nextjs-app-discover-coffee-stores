import { fetchCoffeeStores } from '@/lib/coffee-stores';

export default async (req, res) => {
  const { latLng, limit } = req.query;

  try {
    const response = await fetchCoffeeStores(latLng, 'coffee', limit);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ message: 'Something went wrong!', error });
  }
};
