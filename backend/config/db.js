const mongoose = require('mongoose');

function doConnect() {
    let url = process.env.MONGO_URI;

    mongoose.connect(url) // Stripped options to use Mongoose 6+ defaults
    .then(() => console.log("Mongo Connection Successful!"))
    .catch(err => {
        console.log("Mongo Error Details:", err.message);
    });
}

module.exports = {
    doConnect
}