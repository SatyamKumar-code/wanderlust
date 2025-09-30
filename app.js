const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');

const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');


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

const sessionOptions = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maaxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);


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
