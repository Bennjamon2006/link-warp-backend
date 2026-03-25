import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, LinkWarp API!');
});

export default app;
