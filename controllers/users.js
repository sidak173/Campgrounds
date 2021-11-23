const wrapasync = require('../utils/wrapasync')
const User = require('../models/user')

module.exports.renderregister = (req, res) => {
    res.render('users/register');
};

module.exports.getlogin = (req, res) => {
    res.render('users/login');
};
module.exports.signin = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const { returnto } = req.session;
    if (returnto) {   // to return to page user last useg eg - he wanted to create a new campground but was not logged thus redirected to sign
        delete req.session.returnto;
        return res.redirect(returnto);
    }
    return res.redirect('/campgrounds');
};

module.exports.signup = wrapasync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registereduser = await User.register(user, password);
        req.login(registereduser, e => {
            if (e) { return next(e); }
            req.flash('success', 'Welcome to Campgrounds!');
            return res.redirect('/campgrounds');
        });
    }
    catch (e) {
        // duplicate user name error handling
        req.flash('error', e.message) // this message is comming from passport rather than mongoose
        res.redirect('/register');
    }
});

module.exports.signout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!')
    res.redirect('/');
};