const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const router = require('./routes/index')
const connectMongo = require('connect-mongo')
const session = require('express-session')

/*const indexRouter = require('./routes/index');
const usersRouter = require('./routes/admin');*/

const db = require('./db/db')

const app = express();

app.use(cors({credentials: true, origin: true}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const MongoStore = connectMongo(session)
app.use(cookieParser());

app.use(session({
  name: 'Vicky',
  secret: 'hhh',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({url: 'mongodb://localhost:27017/app', ttl: 7*24*60*60})
}))



app.use(express.static(path.join(__dirname, 'public')));

db.on('error', (e)=>{
  console.log(e)
})

db.once('open', ()=>{
  console.log('数据库连接成功')
})

app.all('*', (req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("X-Powered-By", ' 3.2.1')
  //这段仅仅为了方便返回json而已
  res.header("Content-Type", "application/json;charset=utf-8");
  if(req.method === 'OPTIONS') {
    //让options请求快速返回
    res.sendStatus(200);
  } else {
    next();
  }
})

/*app.use('/', indexRouter);
app.use('/users', usersRouter);*/
router(app)

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
