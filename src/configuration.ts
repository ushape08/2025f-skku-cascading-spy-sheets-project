export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  serverDomain: process.env.SERVER_DOMAIN ?? 'http://localhost:3000',
  mongoDBUri:
    process.env.MONGODB_URI || 'mongodb://localhost/cascading-spy-sheets',
});
