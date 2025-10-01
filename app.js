const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next ) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gamil.com",
    username: "student"
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
})


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
