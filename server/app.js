var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');
var passport = require('passport');
var index = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');

var api = require('./routes/api.route');
var UserService = require('./services/user.service');



//var seedDB = require('./seeds/data');

var app = express();

//populate DB
//seedDB();

// MongoDB Connection
var mongoose = require('mongoose');
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/playlistifyApp', { useMongoClient: true})
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../dist')));
// app.use('/', index);
app.use('/api', api);
app.use('/users', users);

app.use(session({
  name: 'PlaylistifySession,',
  secret: 'mYSupeRsEcrEtKey',
  resave: false,
  saveUninitialized: false,
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
    // profile  {
    // provider: 'spotify',
    // id: '1119198705',
    // username: '1119198705',
    // displayName: 'Loïc Haquin',
    // profileUrl: 'https://open.spotify.com/user/1119198705',
    // photos: [ 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/13627205_10155034200724298_2176009845694240894_n.jpg?oh=c51fc6a82c76a1875dd1909efef0a47d&oe=5B177CEC' ],
    // country: 'FR',
    // followers: 7,
    // product: 'premium',
    // _raw: '{\n  "country" : "FR",\n  "display_name" : "Loïc Haquin",\n  "email" : "loic.haquin@gmail.com",\n  "external_urls" : {\n    "spotify" : "https://open.spotify.com/user/1119198705"\n  },\n  "followers" : {\n    "href" : null,\n    "total" : 7\n  },\n  "href" : "https://api.spotify.com/v1/users/1119198705",\n  "id" : "1119198705",\n  "images" : [ {\n    "height" : null,\n
    //  "url" : "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/13627205_10155034200724298_2176009845694240894_n.jpg?oh=c51fc6a82c76a1875dd1909efef0a47d&oe=5B177CEC",\n    "width" : null\n  } ],\n  "product" : "premium",\n  "type" : "user",\n  "uri" : "spotify:user:1119198705"\n}',
    // _json:
    //  { country: 'FR',
    //    display_name: 'Loïc Haquin',
    //    email: 'loic.haquin@gmail.com',
    //    external_urls: { spotify: 'https://open.spotify.com/user/1119198705' },
    //    followers: { href: null, total: 7 },
    //    href: 'https://api.spotify.com/v1/users/1119198705',
    //    id: '1119198705',
    //    images: [ [Object] ],
    //    product: 'premium',
    //    type: 'user',
    //    uri: 'spotify:user:1119198705' },
    // emails: [ { value: 'loic.haquin@gmail.com', type: null } ] }

    try {
      var userToLogIn = {
        profile: {
          displayName : profile.displayName,
          email : profile.emails[0].value,
        },
        spotify: {
          id : profile.id,
          picture: profile._json.images,
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      };

    UserService.getUserOrCreateUserService(userToLogIn)
      .then(res => {},err => console.log(err));

    } catch (error) {
      console.log(error);
    }
      return done(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/spotify',
passport.authenticate('spotify', {scope: ['user-read-email', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'user-library-read', 'user-top-read', 'user-read-private']}),
function(req, res){
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get('/auth/spotify/callback',
passport.authenticate('spotify', { failureRedirect: '/error' }),
function(req, res) {
  res.redirect('/login');
});

app.get('/auth/spotify/token', (req, res) => {
  // Request to db to find user and spotify token and update response
  if(req.isAuthenticated()){
    var id = req.user.id;
    try {
       UserService.getUserService(id)
        .then(
          user => {
            res.json(user.spotify.accessToken);
          },
          err => {
            console.log('error while retrieving user: ', err);
          }
        );
    } catch (e) {
      console.log(e);
    }
  }
});


app.get('*', (req, res) => {
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
