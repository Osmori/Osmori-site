const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { priceId, customerEmail, customerName } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://osmori.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://osmori.com/cancel`,
      customer_email: customerEmail,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
