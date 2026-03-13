const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (event) => {
  console.log('Function invoked with method:', event.httpMethod);
  console.log('Request body:', event.body);

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed');
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { priceId, customerEmail, customerName } = JSON.parse(event.body);
    console.log('Parsed data:', { priceId, customerEmail, customerName });

    console.log('Creating Stripe session...');
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

    console.log('Stripe session created:', session.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
