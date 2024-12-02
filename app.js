//test commit - ryan eshan
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import commentRoutes from './routes/comment.js';
import foodStallRoutes from './routes/foodStall.js';
import rideRoutes from './routes/ride.js';
import themeParkRoutes from './routes/themePark.js';
import userRoutes from './routes/user.js';


const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    // let the next middleware run:
    next();
  };
  
  app.use('/public', express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(rewriteUnsupportedBrowserMethods);
  
  app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');

  // routes for comments, etc
  app.use('/comments', commentRoutes);
  app.use('/foodstalls', foodStallRoutes);
  app.use('/rides', rideRoutes);
  app.use('/themeparks', themeParkRoutes);
  app.use('/users', userRoutes);


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});