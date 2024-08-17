import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(express.json());
app.use(cookieParser());




app.use('*',(req,res) => {
    res.send("404 Page not found")
})

export default app;