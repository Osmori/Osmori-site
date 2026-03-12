exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Test function working",
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
      nodeVersion: process.version
    }),
  };
};
