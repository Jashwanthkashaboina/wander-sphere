const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const Booking = require('../models/booking.js');



router.route("/signup")
    //To sign-in
    .get(userController.renderSignupForm)
    //to sign-up
    .post(wrapAsync(userController.signup));


router.route("/login")
    //to login
    .get(userController.renderLoginForm)
    //post login
    .post(savedRedirectUrl,
        passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),userController.login);

//logout route
router.get("/logout",userController.logout);

router.get('/auth/google', 
    passport.authenticate('google',{
        scope: ['profile', 'email'],
    }
));


router.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureFlash: true,
    }),

    async(req, res) =>{
        req.flash('success', "Welcome to WanderSphere!");
        res.redirect('/listings');
    }
);


router.get('/profile', async(req, res) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }

    const bookings = await Booking.find({
        user: req.user._id,
    }).populate('listing');
    return res.render('users/profile', { bookings });
})



module.exports = router;