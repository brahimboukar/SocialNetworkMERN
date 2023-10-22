import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import './configuration/database.js';
import postRoutes from './routes/post.routes.js';
import groupRoutes from './routes/group.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { checkUser, requireAuth } from './middleware/auth.middleware.js';

dotenv.config({ path: './configuration/.env' });

const app = express();

// middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

// Json Web Token
app.get('*', checkUser);
app.get(/jwtid/, requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// usage of routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/post', postRoutes);

//ROUTES Cours By BRAHIM
import coursRoutes  from './routes/cours.routes.js';
app.use('/cours' , coursRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});