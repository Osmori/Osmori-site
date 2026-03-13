const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  console.log('Function invoked with method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerEmail, customerName } = req.body;
    console.log('Parsed data:', { priceId, customerEmail, customerName });

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
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error in function:', error);
    res.status(500).json({ error: error.message });
  }
};
