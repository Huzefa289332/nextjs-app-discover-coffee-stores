import { findRecordByFilter, getMinifiedRecords, table } from '@/lib/airtable';

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
    const fetchedRecords = await findRecordByFilter(id);

    if (fetchedRecords.length) {
      res.status(200);

      res.json(fetchedRecords);

      return;
    }

    const createdRecords = await table.create([
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

    const records = getMinifiedRecords(createdRecords);

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
