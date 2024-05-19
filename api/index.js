import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import commentRoutes from './routes/comment.route.js';
import postRoutes from './routes/post.route.js';
import path from 'path';

dotenv.config()


mongoose.connect(process.env.MONGO).then(()=> console.log('MongoDB is connected'))
.catch((err)=> console.log(err))

//path.resolve gets the directory folder of the plcae it is located
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser())

app.listen(3000, () => {
  console.log('Server is running on port 3000!!')
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

//we want to join the front end application to the backend, because the name of the file vite react app would create on build is dist, if its react app then it would be build
app.use(express.static(path.join(__dirname, '/client/dist')));

//because we have to run all the middleware above also before joining whatever address we have above that is not any of the above addess it would run index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})


app.use((err, req, res, next) =>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error'

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})