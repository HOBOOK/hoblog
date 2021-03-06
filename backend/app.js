const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const articleRouter = require('./routes/article');
const leafRouter = require('./routes/leaf');
const userRouter = require('./routes/user');
const s3Router = require('./routes/s3');

const cors = require('cors');

const mongoose = require('mongoose');
const config = require('config');
const dbHost = config.get('dbHost');
const dbPort = config.get('dbPort');
const dbName = config.get('dbName');
const dbAuthenticate = config.get('dbAuthenticate');
const dbUser = config.get('dbUser');
const dbPass = config.get('dbPass');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/articles', articleRouter)
app.use('/api/leafs', leafRouter)
app.use('/api/auth', userRouter);
app.use('/api/s3', s3Router);

app.listen(3000, '0.0.0.0', () => {                                 
  console.log('listen 3000 port')                                 
}); 

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

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER
let connectionString = 'mongodb://'+ dbUser + ':' +  encodeURIComponent(dbPass) +'@'+ dbHost +':' + dbPort + '/' + dbName;

mongoose.connect(connectionString,{ useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

module.exports = app;
