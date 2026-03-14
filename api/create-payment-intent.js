const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerEmail, customerName } = req.body;

    // Retrieve the price to get the amount and currency
    const price = await stripe.prices.retrieve(priceId);

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      payment_method_types: ['card'],
      receipt_email: customerEmail,
      metadata: {
        customerName,
        priceId,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
