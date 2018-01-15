var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');
var passport = require('passport');
var index = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');

var api = require('./routes/api.route');
var UserService = require('./services/user.service');



// var seedDB = require('./seeds/data');

var app = express();

//populate DB
// seedDB();

// MongoDB Connection
var mongoose = require('mongoose');
mongoose.Promise = bluebird;
mongoose.connect('mongodb://127.0.0.1:27017/playlistifyApp', { useMongoClient: true})
      .then(()=> { console.log(`Succesfully Connected to the Mongodb Database at URL : mongodb://127.0.0.1:27017/playlistifyApp`)})
      .catch(()=> { console.log(`Error Connecting to the Mongodb Database at URL : mongodb://127.0.0.1:27017/playlistifyApp`)});


      
// CORS CONFIGURATION
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../dist')));
// app.use('/', index);
app.use('/api', api);
app.use('/users', users);

app.use(session({
  name: 'SpotifySession',
  secret: 'mYSupeRsEcrEtKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));



// Passport Spotify configuration
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(new SpotifyStrategy({
    clientID: '3ec89e264ee040a1af30921007fbc1c4',
    clientSecret: '535992b925044cfca2ad2922fac25489',
    callbackURL: "http://localhost:3000/auth/spotify/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // console.log(profile);
    // console.log('user creation');
    // var email = profile.emails[0].value
    var userId = profile.id;
    var userToLoggedIn = {
      displayName : profile.displayName,
      id : profile.id,
      email : profile.email,
      picture: profile._json.images,
      token: accessToken
    };

    try {
      UserService.getUserOrCreateUserService(userToLoggedIn)
      .then(res => {
      },err => console.log(err));
    } catch (error) {
      console.log(error);
    }

      //console.log('profile: ', profile);
      return done(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/spotify',
passport.authenticate('spotify', {scopes: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-top-read user-read-email user-read-private'}),
function(req, res){
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get('/auth/spotify/callback',
passport.authenticate('spotify', { failureRedirect: '/error' }),
function(req, res) {
  res.redirect('/login');
});

app.get('/auth/spotify/token', (req, res, next) => {
  // Request to db to find user and spotify token and update response

  if(req.isAuthenticated()){
   // console.log('User is authenticated: ', req.user);
    //TODO Retrieve Token


    var id = req.user.id;

    try {
       UserService.getUserService(id)
        .then(
          user => {
           // console.log('user: ', user);
            res.json(user);
          },
          err => {
            console.log('error while retrieving user: ', err);
          }
        );
    } catch (e) {
      console.log(e);
    }

  }
  // var user = req.user
  // delete user['password']
  // var token = jwt.sign({
  //   _id: user._id
  // }, settings.jwt.secret, settings.jwt.options) // good for two hours
  // res.cookie('token', token)
  // debug('end postSignup')
  // res.json({
  //   success: true,
  //   authenticated: true,
  //   user: {
  //     profile: user.profile,
  //     roles: user.roles,
  //     gravatar: user.gravatar,
  //     email: user.email,
  //     _id: user._id
  //   },
  //   token: 'JWT ' + token

});


app.get('*', (req, res) => {
 // console.log(__dirname);
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
