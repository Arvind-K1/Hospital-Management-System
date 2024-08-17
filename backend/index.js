import app from "./app.js";
import { configDotenv } from "dotenv";
import connectToDb from "./db/database.js";

configDotenv();

connectToDb()
    .then(()=>{
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on PORT ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log('MongoDB Connection failed : ',err);
    })