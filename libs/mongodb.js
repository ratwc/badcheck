import { MongoClient } from "mongodb";

const URI = "mongodb+srv://dev:dev@rat-dev.7huwh.mongodb.net/badcheck?retryWrites=true&w=majority"

let client, mongoClientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(URI);
    global._mongoClientPromise = client.connect();
    // console.log("Connection to MongoDB established!");
  }

  mongoClientPromise = global._mongoClientPromise;
  // console.log("Initialized MongoDB successfully!");
} else {
  client = new MongoClient(URI);
  mongoClientPromise = client.connect();
  // console.log("Connection to MongoDB established!");
}

export default mongoClientPromise;
