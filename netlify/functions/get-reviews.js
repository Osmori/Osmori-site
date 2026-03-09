const Airtable = require('airtable');

exports.handler = async (event) => {
  const product = event.queryStringParameters?.product || 'all';
  
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID);
  
  try {
    let records;
    if (product === 'all') {
      records = await base('reviews').select({
        sort: [{ field: 'Timestamp', direction: 'desc' }]
      }).all();
    } else {
      records = await base('reviews').select({
        filterByFormula: `{Product} = '${product}'`,
        sort: [{ field: 'Timestamp', direction: 'desc' }]
      }).all();
    }
    
    const reviews = records.map(record => ({
      rating: record.get('Rating'),
      text: record.get('Review Text'),
      verified: record.get('Verified'),
      date: record.get('Timestamp'),
      product: record.get('Product'),
    }));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ reviews }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
