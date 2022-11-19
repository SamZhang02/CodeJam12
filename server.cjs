const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.static('.'))
app.use(express.json())

app.post('/', (req,res) => {
  const {parcel} = req.body;
  if (!parcel) {
    return res.status(400).send({status: 'failed'});
  }
  res.status(200).send({status: 'received'})
})

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
})