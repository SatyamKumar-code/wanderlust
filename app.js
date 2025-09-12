const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');


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

app.get("/testing", async (req, res) => {
    let sampleLlisting = new Listing({
        title: "My New Villa",
        description: "A beautiful villa located in the heart of the city.",
        price: 500000,
        image: "",
        location: "Calangute, Goa",
        country: "India"
    })
    await sampleLlisting.save();
    console.log("sample was saved");
    res.send("successful testing")
    
});

app.listen(port, () => {
  console.log(`app listening at:${port}`);
});
