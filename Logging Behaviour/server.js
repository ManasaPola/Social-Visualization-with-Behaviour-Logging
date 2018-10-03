var express = require('express');
var app = express();
var port = process.env.PORT || 8082;
var mongoose = require('mongoose');

mongoose.plugin(schema => { schema.options.usePushEach = true });
var passport = require('passport');
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
var morgan = require('morgan');
var d3 = require('d3');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url);
console.log("It will connect to",dbConfig.url);
require('./config/passport')(passport);


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({ secret: 'adaptivewebassignmentone' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Service is running on port: ' + port);
