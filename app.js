import express from 'express';
import path from 'path'
import exphbs from 'express-handlebars'
import { dirname } from 'path';
import {fileURLToPath} from 'url';

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
      }
    }
  });

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// default route
app.get('/', (req, res) => {
    res.render('homePage', {title: "Rate My Theme Park"})
})
app.get('/addThemePark', (req, res) => {
  res.render('addThemeParkPage')
})

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
