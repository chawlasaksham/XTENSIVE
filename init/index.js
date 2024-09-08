const mongoose = require("mongoose");
const initData = require("./init.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/product";

main().then(() =>{
    console.log("connected to db");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj)=>({
            ...obj,
            owner:"66db074b6211ece6fc5f36f0",
            
        }));
        await Listing.insertMany(initData.data);
        console.log("data initialised");
}

initDB();