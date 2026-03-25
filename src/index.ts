import app from './app';
import { connect } from './db';
import config from './config';

connect().catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

const { port, host } = config.server;

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
