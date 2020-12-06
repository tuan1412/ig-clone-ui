const express = require('express');

const app = express();

app.use(express.static('build'));

app.get('*', (req, res) => {
  res.send(__dirname + '/build/index.html');
})

app.listen(8000);