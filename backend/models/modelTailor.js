const mongoose = require("mongoose");

const tailorSchema = {
    // 🔹 Personal Details
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },

    name: {
        type: String,
        trim: true,
    },

    contact: {
        type: String,
    },

    dob: {
        type: Date,
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },

    aadharNumber: {
        type: String,
        select: false, // hidden for security
    },

    profilepic: {
        type: String,
    },

    // 🔹 Professional Details
    category: {
        type: String,
        enum: ["men", "women", "children", "all"],
    },

    speciality: {
        type: String,
    },

    socialLink: String,

    workingSince: Number,

    workType: {
        type: String,
        enum: ["home", "shop", "both"],
        //   required: true,
    },

    shopAddress: String,
    shopCity: String,
    otherInfo: String,
};

//------ TO AVOID __V FIELD IN TABLE COME BY DEFAULT---------------
var ver = {
    versionKey: false,
};

let SchemaClass = mongoose.Schema;

//-------------NEW SCHEMACLASS IS A CLASS THAT RETURN OBJ DESIGN DONE OVER THERE------
let collectionObj = new SchemaClass(tailorSchema, ver);
// COLLECTION CREATE HERE WITH NAME USERCOLLECTION
let tailorColRef = mongoose.model("tailorPersonalCollection", collectionObj);

module.exports = tailorColRef;
