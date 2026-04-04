const mongoose = require("mongoose");

let profSchema = {
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    name: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "",
    },

    profilepic: {
      type: String, // filename / URL
      default: "",
    },

};

//------ TO AVOID __V FIELD IN TABLE COME BY DEFAULT---------------
var ver = {
    versionKey: false
};



let SchemaClass = mongoose.Schema;

//-------------NEW SCHEMACLASS IS A CLASS THAT RETURN OBJ DESIGN DONE OVER THERE------
let collectionObj = new SchemaClass(profSchema,ver);
// COLLECTION CREATE HERE WITH NAME USERCOLLECTION
let custColRef = mongoose.model("customerProfCollection",collectionObj);

module.exports = custColRef; 

