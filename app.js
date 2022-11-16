const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars')
const session = require('express-session')

const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const dotenv = require('dotenv').config();
// dotenv.config({ path: './.env' })

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname :'hbs', defaultLayout : 'layout', layoutsDir: __dirname+'/views/layouts/', partialsDir : __dirname + '/views/partials/',helpers:{
  multiply: (value1, value2)=> value1 * value2,
  add : (value1, value2) => value1 + value2,
  resetIndex: (value) => value + 1,
  eq: (value1,value2) => value1===value2,
  arrayLen: (array) => array.length
} }))



//Logger
 app.use(logger('dev'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : "Hari", cookie: {maxAge: 1000 * 60 * 60 * 24 }}))

app.use((req, res, next) => {
  res.set("cache-control", "no-store");
  next();
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
