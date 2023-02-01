import mongoose, { ConnectOptions } from "mongoose";

export const connectDB = async () => {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI! || 'mongodb://localhost:27017/katharus-back',
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions, () =>{
        console.log('MongoBD connected!');
    });
}