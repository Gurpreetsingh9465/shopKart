var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var userRoutes = require('./routes/user')
var mongoose = require('mongoose');
var passport = require("passport");
var flash = require("connect-flash");
var app = express();
var session = require('express-session')
var mongoStore = require('connect-mongo')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//mongoose.connect("mongodb://localhost/collegeKart");
mongoose.connect("mongodb://gurpreet:qwerty123@ds147180.mlab.com:47180/collegekart");
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

require('./config/passport')

app.use(session({
  secret:"nansjnsjbdhe#$$%4bhbr27@###4",
  resave:false,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie:{maxAge: 180*60*1000}

}))

app.use(flash());
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next()
})


app.use('/user',userRoutes)
app.use('/', routes);

app.listen(3000,()=>{
  console.log("running at 127.0.0.1:3000");
});

// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
//
// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });
