var express = require("express");
var cors = require("cors");
var fileUploader = require("express-fileupload");
var path = require("path");
var userRouter = require("./routers/userRouter");
var tailorRouter = require("./routers/tailorRouter");
var { doConnect } = require("./config/db");
const { model } = require("mongoose");

var app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded(true));
app.use(fileUploader());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


doConnect();

app.listen(5002, (req, res) => {
    console.log("Server is running at port-" + 5002);
});

app.use("/user", userRouter);
app.use("/tailor", tailorRouter);

//-------------IF REQUEST FOR INVALID URL HANDLER---------------------
app.use((req, res) => {
    console.log(req.method, req.url);
    res.status(404).send("Invalid URL..");
});

modele.exports = app;