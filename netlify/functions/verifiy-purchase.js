const Airtable = require('airtable');

exports.handler = async (event) => {
  const { email, product } = JSON.parse(event.body);
  
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID);
  
  try {
    const records = await base('orders').select({
      filterByFormula: `AND({Customer Email} = '${email}', {Product} = '${product}', {Status} = 'completed')`
    }).firstPage();
    
    const hasPurchased = records.length > 0;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ verified: hasPurchased }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
