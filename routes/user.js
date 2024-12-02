import {Router} from "express"
const router = Router();
import bcrypt from 'bcryptjs';

router.get('/', async (req, res) => {
    res.json({route: '/users', method: req.method});
  });
  
  router.post('/', async (req, res) => {
    res.json({route: '/users', method: req.method});
  });
  
  router.post('/login', async (req, res) => {
    req.session.user = {firstName: 'Patrick', lastName: 'Hill', userId: 123};
    res.redirect('/private');
  });
  
  router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.send('Logged out');
  });

export default router;