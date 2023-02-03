import mongoose,{ConnectOptions} from "mongoose";

export const connectDB = async () => {
    mongoose.set('strictQuery', false);
    await mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/katharus-back", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  } as ConnectOptions)
  .then((db) => {
    console.log("Database Connected Successfuly.");
  })
  .catch((err) => {
    console.log("Error Connectiong to the Database");
    throw err;
  });
}