const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const menusRouter = require('./routes/menus');
const qrsRouter = require('./routes/qr');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menus', menusRouter);
app.use('/qr', qrsRouter);

module.exports = app;
