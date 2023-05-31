require('dotenv').config()
var express = require('express');
var path = require('path');
var app = express();

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let fileUpload = require('express-fileupload');


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/users');
var driverRouter = require('./routes/driver');
var storeRouter = require('./routes/store');


var app = express();
app.use(fileUpload());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/driver', driverRouter);

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
app.listen(process.env.APP_PORT, function() {
    console.clear();
    console.log(`${process.env.APP_NAME} is running on ${process.env.APP_PORT} !`)
})

module.exports = app;