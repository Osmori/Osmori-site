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

    // Create the Stripe session with ui_mode: 'embedded'
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded', // THIS is the magic line for embedded checkout
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      return_url: `https://osmori.com/return?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: customerEmail,
    });

    console.log('Stripe session created:', session.id);
    // We send back the clientSecret so the frontend can mount the form
    res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error in function:', error);
    res.status(500).json({ error: error.message });
  }
};
