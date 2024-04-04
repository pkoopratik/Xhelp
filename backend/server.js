import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
connectDB();
//Mogo=mongodb+srv://pratik:<password>@xhelp.qksxiai.mongodb.net/
const app= express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//Routes
app.use("/api/users",userRoutes)


app.listen(PORT,()=>{console.log(`listening on post ${PORT}`)})