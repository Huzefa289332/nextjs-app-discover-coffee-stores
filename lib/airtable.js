import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIR_TABLE_API_KEY }).base(
  process.env.AIR_TABLE_BASE_ID
);

export const table = base('coffee-stores');

const getMinifiedRecord = record => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

export const getMinifiedRecords = records => {
  return records.map(record => getMinifiedRecord(record));
};

export const findRecordByFilter = async id => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};
