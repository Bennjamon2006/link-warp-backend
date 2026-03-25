import express from 'express';

import { connect } from './db';

connect().catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, LinkWarp API!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
