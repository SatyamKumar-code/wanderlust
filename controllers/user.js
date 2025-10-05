const User = require('../models/user');


// signup form Page
const signupForm = (req, res) => {
    res.render("users/signup");
};

// singup Post 

const signupUser = async ( req, res ) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Login form Page
const loginForm =  ( req, res ) => {
    res.render("users/login");
};

// Login post 
const loginUser =  async ( req, res ) => {
    req.flash("success", "Welcome back to wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

// Logout
const logoutUser = ( req, res, next ) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};


module.exports = { signupForm, signupUser, loginForm, loginUser, logoutUser }