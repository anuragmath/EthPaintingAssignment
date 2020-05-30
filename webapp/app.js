var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "replace mnemonic here";

// web3 version 1.0.0 has changed the syntax for setting the current provider
const provider = new HDWalletProvider(mnemonic, "http://localhost:8545");


var web3js = new Web3(provider);
exports.web3js = web3js;

const jwt = require('jsonwebtoken');
const https = require('https');

const apiKey = '181efaeb-9d95-488d-a448-2e2c6dfea0fd';
const secretKey = 'ajCa3lsN6hiifG60vrWKAj3EzeDJWnobAECZBUUTXqU';
const tokenCreationTime = Math.floor(Date.now() / 1000);
const payload = { iss: apiKey, iat: tokenCreationTime };

//jwt library uses HS256 as default.
const token = jwt.sign(payload, secretKey);
const options = {
  host: 'api.ristaapps.com',
  path: '/v1/items?branch=2&channel=Delivery',
  headers: {
    'x-api-key': apiKey,
    'x-api-token': token,
    'content-type': 'application/json'
  }
};

https.get(options, function (res) {
  console.log(res);
 });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/dashboard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
