const express = require('express');
const app = express();
const PORT = 8000;
const querystring = require('querystring');

app.use(express.static('.'))
app.use(express.json())

app.get ('/json', (req, res) => {
  console.log(querystring.decode(req._parsedUrl.query));
  res.send('hello world')
})

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
})