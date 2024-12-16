import express from 'express';
import path from 'path'
import exphbs from 'express-handlebars'
import { dirname } from 'path';
import {fileURLToPath} from 'url';
import configRoutes from './routes/index.js'
import session from 'express-session';

let app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static('public');

app.set('views', path.join(__dirname, 'views'));
const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },

    partialsDir: ['views/partials/']
  }
});

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// creates a session
app.use(session({
  name: 'AuthenticationState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false})
)

// using some middleware if we hit the /, we will check if theres a req.session.user if there isn't redirect them to signin
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/themepark');
  } 
  else {
    return res.redirect('/signinuser');
  }
});

app.use('/signinuser', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/themepark');
  }
  next();
});

app.use('/signupuser', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/themepark');
  }
  next();
});

app.use('/themepark', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signinuser');
  }
  next();
});

// app.use((req, res, next) => {
//   if (!req.session.user){
//     return res.redirect('/signinuser')
//   }
//   next();
// })


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
