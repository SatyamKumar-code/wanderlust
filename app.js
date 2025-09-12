const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');


const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

// index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
})

// new Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// show Route
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
})

//Create Route
app.post("/listings", async(req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})


// app.get("/testing", async (req, res) => {
//     let sampleLlisting = new Listing({
//         title: "My New Villa",
//         description: "A beautiful villa located in the heart of the city.",
//         price: 500000,
//         image: "",
//         location: "Calangute, Goa",
//         country: "India"
//     })
//     await sampleLlisting.save();
//     console.log("sample was saved");
//     res.send("successful testing")
    
// });

app.listen(port, () => {
  console.log(`app listening at:${port}`);
});
