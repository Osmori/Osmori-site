exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Test function working",
      hasStripeKey: process.env.STRIPE_SECRET_KEY ? true : false,
      hasAirtableKey: process.env.AIRTABLE_API_KEY ? true : false,
      hasAirtableBase: process.env.AIRTABLE_BASE_ID ? true : false,
      nodeVersion: process.version
    }),
  };
};
