const Airtable = require('airtable');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, product, rating, reviewText } = JSON.parse(event.body);

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Verify purchase
    const orders = await base('orders').select({
      filterByFormula: `AND({Customer Email} = '${email}', {Product} = '${product}', {Status} = 'completed')`
    }).firstPage();

    if (orders.length === 0) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Must purchase before reviewing' }),
      };
    }

    // Save review
    await base('reviews').create({
      'Customer Email': email,
      'Product': product,
      'Rating': parseInt(rating),
      'Review Text': reviewText,
      'Verified': true,
      'Timestamp': new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
