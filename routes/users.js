const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isloggedin,mailalreayindb } = require('../middleware');
const { renderregister, getlogin, signin, signout, signup } = require('../controllers/users')



router.route('/register')
    .get(renderregister)
    .post(signup)

router.route('/login')
    .get(getlogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), signin)

router.get('/logout', isloggedin, signout)

router.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        failureFlash: true,
        failureRedirect: '/login',
    }),signin); 

module.exports = router;