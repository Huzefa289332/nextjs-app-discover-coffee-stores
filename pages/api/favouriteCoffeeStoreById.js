import { findRecordByFilter, getMinifiedRecords, table } from '@/lib/airtable';

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(404);

    res.json({ message: 'Not Found' });

    return;
  }

  const { id } = req.body;

  if (!id) {
    res.status(400);

    res.json({ message: 'id is missing' });

    return;
  }

  try {
    const fetchedRecords = await findRecordByFilter(id);

    if (!fetchedRecords.length) {
      res.status(400);

      res.json({ message: 'Coffee store not found' });

      return;
    }

    const record = fetchedRecords[0];

    const voting = parseInt(record.voting) + 1;

    const updatedRecord = await table.update(
      [
        {
          id: record.recordId,
          fields: {
            voting: voting,
          },
        },
      ],
      {}
    );

    const records = getMinifiedRecords(updatedRecord);

    res.status(200);

    res.json(records);

    return;
  } catch (error) {
    console.error('favouriteCoffeeStoreById ==> ', error);

    res.status(500);

    res.json({ message: 'Something Went Wrong' });

    return;
  }
};
