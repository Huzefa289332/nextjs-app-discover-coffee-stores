import { getMinifiedRecords, table } from '@/lib/airtable';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(404);

    res.json({ message: 'Not Found' });

    return;
  }

  const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

  if (!id || !name) {
    res.status(400);

    res.json({ message: 'id or name is missing' });

    return;
  }

  try {
    const findCoffeeStoreRecords = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();

    if (findCoffeeStoreRecords.length) {
      const records = getMinifiedRecords(findCoffeeStoreRecords);

      res.status(200);

      res.json(records);

      return;
    }

    const createRecords = await table.create([
      {
        fields: {
          id,
          name,
          address,
          neighbourhood,
          voting,
          imgUrl,
        },
      },
    ]);

    const records = getMinifiedRecords(createRecords);

    res.status(201);

    res.json(records);

    return;
  } catch (error) {
    console.error('createCoffeeStore ==> ', error);

    res.status(500);

    res.json({ message: 'Something Went Wrong' });

    return;
  }
};
