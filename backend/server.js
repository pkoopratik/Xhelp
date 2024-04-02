import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
dotenv.config();
connectDB();
//Mogo=mongodb+srv://pratik:<password>@xhelp.qksxiai.mongodb.net/
const app= express();

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{console.log(`listening on post ${PORT}`)})