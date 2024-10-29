import { MongoClient } from 'mongodb';

const uri: string = process.env.NEXT_PUBLIC_MONGODB_URI as string;
const options = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient>;


if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

console.log("HPU: ", process.env.NEXT_PUBLIC_MONGODB_URI);

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the MongoClient
  // across hot-reloads (otherwise, you'll get multiple clients)
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/* eslint-enable @typescript-eslint/no-explicit-any */

export default clientPromise;

