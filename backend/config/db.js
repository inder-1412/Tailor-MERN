const mongoose = require('mongoose');

function doConnect() {
    let url = "mongodb+srv://inderjeetis917_db_user:jR6eOe6FDJdtQzlQ@cluster0.gpnh6ei.mongodb.net/MernProjDB?retryWrites=true&w=majority&appName=Cluster0";

    mongoose.connect(url) // Stripped options to use Mongoose 6+ defaults
    .then(() => console.log("Mongo Connection Successful!"))
    .catch(err => {
        console.log("Mongo Error Details:", err.message);
    });
}

module.exports = {
    doConnect
}