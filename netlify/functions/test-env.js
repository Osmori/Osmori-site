exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
    }),
  };
};
