const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  filename: {
    type: String,
    default: 'defaultImage'
  },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1709884735626-63e92727d8b6?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) => v === "" ? "https://images.unsplash.com/photo-1709884735626-63e92727d8b6?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
  }
});

const listingSchema = new Schema({
  title: { 
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: imageSchema,
    default: () => ({})
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

