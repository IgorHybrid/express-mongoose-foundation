import mongoose from "mongoose";

beforeAll(async () => {
    // put your client connection code here, example with mongoose:
    await mongoose.connect(process.env.MONGO_URI || "mongo-uri-jest");
});

beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})));
});

afterAll(async () => {
    // put your client disconnection code here, example with mongodb:
    await mongoose.disconnect();
});