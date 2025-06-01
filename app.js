var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books')


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
app.use('/books', booksRouter);

// improved 404 error handler using template
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = "Sorry! We couldn't find the page you were looking for.";
  res.render('page-not-found', { err });
});

// error handler
app.use(function(err, req, res, next) {
  //defaults error status and message
  err.status = err.status || 500;
  err.message = err.message || "Sorry! There was an unexpected error on the server.";

  console.log('Error Status:', err.status);
  console.log('Error Message:', err.message);

  res.status(err.status);
  res.render('error', { err })
  
});

module.exports = app;

//testing and syncing the db connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection successful!');

    await sequelize.sync();
    console.log('Synced successfully');
  } catch (error) {
    console.error('Error connecting:', error)
  }
})();