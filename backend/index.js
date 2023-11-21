import express from 'express';
import { PORT, mongodbURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import router from './routes/booksRoute.js';
import cors from 'cors';

const app = express();
app.use(express.json());   //Middleware for parsing request body
app.use('/', router);
//app.use(cors());   //Middleware for handling CORS policy (allows all origins)
app.use(cors({
    origin:'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}))


app.listen(PORT, () => {
  console.log(`sERVER is listening on port ${PORT}`);
});

mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log('App connected to database!');
        
    })
    .catch((err) => {
        console.log(err);
        
    })
