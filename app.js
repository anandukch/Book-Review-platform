var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fileUpload=require('express-fileupload');
var hbs=require('express-handlebars');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var usersRouter = require('./routes/users');
var app = express();
var session=require('express-session');
// const mongoose=require('mongoose');
// env var
var db=require('./config/connection')

// 

// mongoose.connect(
//   `mongodb+srv://${process.env.MONGO_BD_USER}:${process.env.MONGO_BD_PASSWORD}@cluster0.6fxys.mongodb.net/${process.env.MONGO_BD_DATABASE}?retryWrites=true&w=majority`,
//    {useNewUrlParser: true,
//      useUnifiedTopology: true,}
//    ).then(()=>{
//      console.log('Database started');
//    })
//    ;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({extname:'hbs', defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}))


app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({useTempFiles:true}));
app.use(session({secret:'Key',cookie:{maxAge:800000}}));
db.connect((err)=>{
  if(err) console.log('errr  : '+err);
  else console.log('database');
  
})


app.use('/', usersRouter);





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
