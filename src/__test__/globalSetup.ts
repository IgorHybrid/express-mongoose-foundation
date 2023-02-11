
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

export = async function globalSetup() {
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));

    const mongooseDB = await mongoose.connect(`${process.env.MONGO_URI}/jest-test`);
    await mongooseDB.connection.db.dropDatabase();
    await mongoose.disconnect();
}