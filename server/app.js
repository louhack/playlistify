var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');
var passport = require('passport');
var index = require('./routes/index');
// var users = require('./routes/users');
var session = require('express-session');

const MongoStore = require('connect-mongo');

require('dotenv-safe').config();

const config = require('config');

var api = require('./routes/api.route');
var UserService = require('./services/user.service');
var middleware = require("./middleware/auth.middleware");




var app = express();

// MongoDB Connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbPlaylistify =
mongoose.connect(config.get('Database.host'),  {
  useNewUrlParser: true,
  useUnifiedTopology: true })
      .then((m)=> {
        console.log(`Succesfully Connected to the Mongodb Database : %s`, config.get('Database.db_name'));
        return m.connection.getClient();
      })
      .catch(()=> { console.log(`Error Connecting to the Mongodb Database : %s`, config.get('Database.db_name'));});

mongoose.connection.on('error', err => {
        logError(err);
      });

//const dbPlaylistify = mongoose.connection.getClient();

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
app.use(logger('dev')); // SET LOGGER
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../dist'))); // DIRECTORY FOR FRONT-END

//console.log(dbPlaylistify);

// SESSION CONFIGURATION
app.use(session({
  name: config.get('Session.name'),
  secret: config.get('Session.secret'),
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      clientPromise: dbPlaylistify,
      collectionName: 'sessions',
      stringify: false,
      autoRemove: 'interval',
      autoRemoveInterval: 1}),
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
    clientID: config.get('Spotify.clientID'),
    clientSecret: config.get('Spotify.clientSecret'),
    callbackURL: config.get('Spotify.callbackURL')
  },
  function (accessToken, refreshToken, expires_in, profile, done) {
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
          refreshToken: refreshToken,
          expires_in: Date.now()+expires_in
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


// ROUTE INITIALIZATION
app.use('/api', api);


// AUTHENTICATION ROUTE USING SPOTIFY PASSPORT
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

app.get('/auth/spotify/token', middleware.isLoggedIn, (req, res) => {
  // Request to db to find user and spotify token and update response
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

function logError(err) {
  console.error(err);
}

module.exports = app;
