const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

const MONGO_URI = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log('connected to MongoDB')
}).catch(err => {
    console.log(err)
});

async function main() {
    await mongoose.connect(MONGO_URI);
}
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`app listening at:${port}`);
});
