const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true
    },
    star: {
      type: Number,
      required: true
    },
    review: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

var ver = {
    versionKey: false,
};

let SchemaClass = mongoose.Schema;

let collectionObj = new SchemaClass(reviewSchema, ver);
// COLLECTION CREATE HERE WITH NAME USERCOLLECTION
let reviewColRef = mongoose.model("customerReviewAboutTailor", collectionObj);

module.exports = reviewColRef;
