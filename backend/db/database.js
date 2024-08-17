import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/HMS`);
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed",error);
        process.exit(1);
    }
}

export default connectToDb;