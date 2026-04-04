const mongoose = require("mongoose");

let userSchema = {
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    pwd: {
        type: String,
        required: true,
    },

    userType: {
        type: String,
        required: true,
    },

    status: {
        type: Boolean,
        default: true, // true = active, false = blocked
    },

    dos: {
        type: Date,
        default: Date.now,
    },

};

//------ TO AVOID __V FIELD IN TABLE COME BY DEFAULT---------------
var ver = {
    versionKey: false
};



let SchemaClass = mongoose.Schema;

//-------------NEW SCHEMACLASS IS A CLASS THAT RETURN OBJ DESIGN DONE OVER THERE------
let collectionObj = new SchemaClass(userSchema,ver);
// COLLECTION CREATE HERE WITH NAME USERCOLLECTION
let userColRef = mongoose.model("userCollection",collectionObj);

module.exports = userColRef; 

