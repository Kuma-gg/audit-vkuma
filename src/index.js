const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
//initializations
const app = express();
require('./database');
require('./config/passports');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    defaultsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), '/partials'),
    helpers: require('./helpers/handlebars'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
//middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user_session = req.user || null;
    
    next();
  });
  
  
// routes
app.use(require('./routes/index'));
app.use(require('./routes/parameters'));
app.use(require('./routes/users'));
// static files
app.use(express.static(path.join(__dirname,'public')));
// server listening 



app.listen(app.get('port'), () => {
    
    console.log('server on ', app.get('port'),);
});


