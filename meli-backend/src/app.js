const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiRouter = require('./routes/api/apiRoutes')
const authorMiddleware = require('./middlewares/api/author')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(authorMiddleware)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', apiRouter);


module.exports = app;
