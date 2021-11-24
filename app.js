if (process.env.NODE_ENV !== 'production') {
    // enviroment variable which is either development or production
    require('dotenv').config();
    // this takes variables in .env file and adds them to process.env
    // used in development mode
}

const express = require('express')
const path = require('path');
const ejsmate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const expresserror = require('./utils/error');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoSanitize = require('express-mongo-sanitize'); // for handling mongo injection
const helmet = require("helmet"); //Helmet helps secure  Express apps by setting various HTTP headers
const db_url = process.env.DB_URL || 'mongodb://localhost:27017/campgrounds';
// || for development mode 

const mongostore = require('connect-mongo'); // for storing sessions on our mongo DB


const User = require('./models/user')

const campgroundroutes = require('./routes/campgrounds');
const reviewroutes = require('./routes/reviews');
const userroutes = require('./routes/users')


const app = express();


mongoose.connect(db_url);


app.engine('ejs', ejsmate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
    contentSecurityPolicy: false,
}));
// this enables 10 middlewares which are sets various headers to make the app more secure  - CSP is disabled

app.use(mongoSanitize());
// This module removes any keys in objects that begin with a $ sign 
//or contain a ., from req.body, req.query or req.params
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'))); // serving static files in  public directory. These files could be used by files in views directory

const secret = process.env.secret || 'greatsecret!'; // process.env.secret will be on heroku

app.use(session({
    secret,
    resave: false,
    saveUninitialized: true, // to avoid decrapation warning
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Date.now() is in miliseconds cookie expires after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // secure:true, // cookies should work over HTTPS, this breaks our authentication over localhost since local host is not HTTPS
        httpOnly: true // prevents cookie from being accesed by client side scripts (securtiy). They can be accesed over HTTP only
    },
    store: mongostore.create({  // creates a new sessions collection in our Databse
        mongoUrl: db_url,
        touchAfter: 24 * 3600, // in seconds session will be update only once every 24hrs no matter number of refreshs or requests made
        crypto: { //  using encryption
            secret
        }
    })

}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  // middleware for persistent login sessions , app.use(session()) must be be before passport.session()



passport.use(new LocalStrategy(User.authenticate())); // authenticate is static method added by passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://protected-everglades-66881.herokuapp.com/google/callback", // url after  login to google // http://localhost:3000/google/callback -development mode
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({ email: profile.email, username: profile.displayName }, function (err, user) {
            return done(err, user);
        });
    }
));

app.use((req, res, next) => {
    // console.log(req.query); -> checking express-mongo-sanitize
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentuser = req.user;
    console.log(req.user);
    next();
})

app.use("/campgrounds", campgroundroutes);
app.use("/campgrounds/:campid/reviews", reviewroutes);
app.use("", userroutes);

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})


app.all('*', (req, res, next) => {
    next(new expresserror('page not found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something went Wrong'
    }
    res.status(statusCode).render('campgrounds/error', { err })
})

const port = process.env.PORT || 3000;   // port added in by heroku

app.listen(port, () => {
    console.log(`On port ${port}!`);
})

// .gitignore tells git to ignore .env and node_modules file 