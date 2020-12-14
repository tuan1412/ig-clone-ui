const express = require('express');
const path = require('path')
const app = express();

app.use(express.static('build'));

app.get('*', (req, res) => {
  res.send(path.join(__dirname, 'app/build/index.html'));
})

app.listen(process.env.PORT || 8000);