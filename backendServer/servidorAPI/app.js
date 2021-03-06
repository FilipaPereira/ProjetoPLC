var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport')

var app = express();


// Conexão base de dados
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://taliban:pri20192020@pri2019-oycpr.mongodb.net/test?retryWrites=true&w=majority', {dbName:"pri2019", useUnifiedTopology: true, useNewUrlParser: true})
        .then(() => console.log("--> MongoAtlasDB connected\n"))
        .catch((error) => console.log("--> MongoAtlasDB connection refused\n" + error))



// Routes
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var groupsRouter = require('./routes/groups');

require('./middleware/passport');

function canAccess(req,done){
  console.log(req)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
//app.use('/post',[passport.authenticate('jwt',{session: false}),canAccess,express.static(path.join(__dirname, 'post'))]);
app.use(cors());
app.use(logger('dev'));
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/groups',groupsRouter)



// catch 404 and forward to error hsandler
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
