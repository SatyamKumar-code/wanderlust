const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');


const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// new Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));

//Create Route
app.post("/listings",
  wrapAsync(async (req, res, next) => {
    // Support both flat and nested form data
    const data = req.body.listing ? req.body.listing : req.body;
    let result = listingSchema.validate({ listing: data });
    if (result.error) {
      throw new ExpressError(400, result.error.details[0].message);
    }
    const newListing = new Listing(data);
    await newListing.save();
    res.redirect("/listings");
  })
);

// edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if (!req.body) {
    throw new ExpressError(400, "send valid data for listing");
  }
  const data = req.body.listing ? req.body.listing : req.body;
  let result = listingSchema.validate({ listing: data });
  if (result.error) {
    throw new ExpressError(400, result.error.details[0].message);
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, data);
  res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
}));

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

app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
  let { statusCode=500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`app listening at:${port}`);
});
