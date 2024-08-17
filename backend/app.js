import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(express.json());
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users",userRouter);


app.use('*',(req,res) => {
    res.send("404 Page not found")
})

export default app;