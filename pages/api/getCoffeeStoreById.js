import { findRecordByFilter, table } from '@/lib/airtable';

export default async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400);

    res.json({ message: 'id is missing' });

    return;
  }

  try {
    const records = await findRecordByFilter(id);

    res.status(200);

    res.json(records);

    return;
  } catch (error) {
    console.error('getCoffeeStoreById ==> ', error);

    res.status(500);

    res.json({ message: 'Something Went Wrong' });

    return;
  }
};
