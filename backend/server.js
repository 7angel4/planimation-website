const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from Firebase!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
