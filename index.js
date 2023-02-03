import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/posts.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();


app.use(express.urlencoded({extended: true, limit: "30mb"}));
app.use(express.json({limit: "30mb"}));
app.use(cors());


app.use('/posts', router);
app.use("/user", userRoutes);



const {
    CONNECT_URL,
    PORT
} = process.env

mongoose.connect(CONNECT_URL, {useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log('Successful connection to the database'))
    .then(()=> app.listen(PORT, () => console.log(`Connected to port: ${PORT}`)))
    .catch((e) => console.log({e}));
