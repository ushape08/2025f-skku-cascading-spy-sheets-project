export default () => ({
  PORT: parseInt(process.env.PORT || '3000', 10),
  SERVER_DOMAIN: process.env.SERVER_DOMAIN ?? 'http://localhost:3000',
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost/cascading-spy-sheets',
});
