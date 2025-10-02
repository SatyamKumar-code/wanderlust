const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URI);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68de7e512fc47b58ddc25da3" }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
    mongoose.connection.close();
}
initDB();
