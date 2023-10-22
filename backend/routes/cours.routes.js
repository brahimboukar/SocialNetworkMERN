import express  from "express";
import { checkUser, requireAuth } from '../middleware/auth.middleware.js';
const route = express.Router();

import coursController  from '../controllers/cours.controller.js';

route.post('/add' ,checkUser, coursController.add);
route.get('/list' ,coursController.list);
route.get('/:id',  coursController.getCours);
route.delete('/delete/:id' ,checkUser, coursController.deletea);
route.put('/update/:id' , coursController.update);
route.get('/search/:key',  coursController.coursGet);

export default route;