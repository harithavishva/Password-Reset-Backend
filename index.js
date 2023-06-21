import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { register, login, forgotPassword, resetPass } from './controller/controller.js';
import { sendEmailToHaritha } from './helper/helper2.js';


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());


app.post('/register', register);
app.post('/login', login);
app.post('/forgotPassword', forgotPassword);
app.post('/resetPassword', resetPass);
app.post('/portfolio/email', sendEmailToHaritha);


await mongoose.connect(process.env.MONGOBD)
    .then(() => console.log("Connected to Database"))
    .then(() => app.listen(process.env.PORT))
    .then(() => console.log("Server Started"))
    .catch((err) => console.log(err))