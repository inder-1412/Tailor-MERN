const bcrypt = require("bcryptjs");
const path = require("path");
var UserColRef = require("../models/modelUser");
var custColRef = require("../models/modelCustomer");
const nodemailer = require("nodemailer");
var tailorColRef = require("../models/modelTailor");
var reviewColRef = require("../models/modelReview");

require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const doSignUp = (req, resp) => {
    // console.log(req.body);

    let objUserColRef = new UserColRef(req.body);

    objUserColRef
        .save()
        .then((doc) => {
            console.log(doc);

            const mailOptions = {
                from: `"Your App Name" <${process.env.EMAIL_USER}>`,
                to: req.body.email,
                subject: "Registration Successful 🎉",
                html: `
                    <h2>Welcome!</h2>
                    <p>Your account has been successfully created.</p>
                    <p>You can now log in and start using our services.</p>
                    <br/>
                    <p>Thank you for joining us.</p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return console.log(error);
                console.log("Message sent: %s", info.messageId);
            });

            resp.status(200).json({
                status: true,
                msg: "Signup successful",
                doc: doc,
            });
        })
        .catch((err) => {
            console.log(err.message);

            // Duplicate email handling
            if (err.code === 11000) {
                return resp.status(200).json({
                    status: false,
                    msg: "Email already registered",
                });
            }

            resp.status(200).json({
                status: false,
                msg: err.message,
            });
        });
};

const doLogIn = (req, resp) => {
    let { email, pwd } = req.body;

    if (!email || !pwd) {
        return resp.status(400).json({
            status: false,
            msg: "Email and password are required",
        });
    }

    UserColRef.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return resp.status(200).json({
                    status: false,
                    msg: "Invalid email or password",
                });
            }

            if (user.status === false) {
                return resp.status(200).json({
                    status: false,
                    msg: "User is blocked. Contact admin",
                });
            }

            if (pwd != user.pwd) {
                return resp.status(200).json({
                    status: false,
                    msg: "Invalid email or password",
                });
            }

            resp.status(200).json({
                status: true,
                msg: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    userType: user.userType,
                },
            });
        })
        .catch((err) => {
            resp.status(500).json({
                status: false,
                msg: err.message,
            });
        });
};

const custProfile = (req, resp) => {
    let fileName = req.files.profilepic.name;
    let uploadFolderPath = path.join(__dirname, "..", "uploads", fileName);
    req.files.profilepic.mv(uploadFolderPath);
    req.body.filePath = uploadFolderPath;

    // req.body.dos = new Date().toString();

    //-------IMPORTANT NAME SHOULD BE SAME AS IN MODEL WE DECLARED ----------
    req.body.profilepic = fileName;
    // uploadImage(uploadFolderPath);

    let objUserColRef = new custColRef(req.body);
    objUserColRef
        .save()
        .then((doc) => {
            console.log(doc);
            resp.status(200).json({
                status: true,
                msg: "Record saved.",
                doc: doc,
            });
        })
        .catch((err) => {
            resp.status(200).json({
                status: false,
                msg: err.message,
            });
        });
};

const fetchCustomer = (req, resp) => {
    const { email } = req.body;

    custColRef
        .findOne({ email: email })
        .then((doc) => {
            if (!doc) {
                return resp.status(404).json({
                    status: false,
                    msg: "User not found",
                });
            }

            resp.status(200).json({
                status: true,
                msg: "User fetched successfully",
                doc: doc,
            });
        })
        .catch((err) => {
            console.error(err.message);
            resp.status(500).json({
                status: false,
                msg: "Server error",
            });
        });
};

const profUpdateCustomer = (req, resp) => {
    const { email, name, address, city, state, gender } = req.body;

    // console.log(req.body);

    if (req.files) {
        var fileName = req.files.profilepic.name;
        let uploadFolderPath = path.join(__dirname, "..", "uploads", fileName);
        req.files.profilepic.mv(uploadFolderPath);
        req.body.filePath = uploadFolderPath;

        req.body.profilepic = fileName;
    } else {
        req.body.profilepic = req.body.profilepic;
    }

    // console.log(req.body.profilepic);

    custColRef
        .updateOne(
            { email: email },
            {
                $set: {
                    name: name,
                    address: address,
                    city: city,
                    state: state,
                    gender: gender,
                    profilepic: fileName || req.body.profilepic,
                },
            },
        )
        .then((result) => {
            if (result.matchedCount == 0) {
                resp.status(200).json({
                    status: false,
                    msg: "No record found to update here...",
                });
            } else {
                resp.status(200).json({
                    status: true,
                    msg: "Update Successfully ...",
                    res: result,
                });
            }
        })
        .catch((err) => {
            console.log(err.message);
            resp.status(500).json({
                status: false,
                msg: err.message,
            });
        });
};

const getTailorByMobile = (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.json({
            status: false,
            msg: "Mobile number required",
        });
    }

    tailorColRef
        .findOne({ contact: mobile })
        .then((tailor) => {
            if (!tailor) {
                return res.json({
                    status: false,
                    msg: "Tailor not found",
                });
            }

            res.json({
                status: true,
                name: tailor.name,
                mobile: tailor.contact,
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                status: false,
                msg: "Server error",
            });
        });
};

const addTailorReview = (req, res) => {
    const { mobile, star, review } = req.body;

    if (!mobile || !star || !review) {
        return res.json({
            status: false,
            msg: "All fields required",
        });
    }

    let objColRef = new reviewColRef(req.body);

    objColRef
        .save()
        .then(() => {
            res.json({
                status: true,
                msg: "Review added successfully",
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                status: false,
                msg: "Error adding review",
            });
        });
};

const getCities = (req, res) => {
    
    tailorColRef.distinct("shopCity")
        .then((cities) => {
            res.json({
                status: true,
                data: cities,
            });
        })
        .catch((err) => {
            console.log(err);

            res.json({
                status: false,
                msg: "Failed to fetch cities",
            });
        });
};


const getDressTypes = (req, res) => {

    const category = req.body.category;

    tailorColRef.distinct("speciality", { category: category })
        .then((dressTypes) => {

            res.json({
                status: true,
                data: dressTypes
            });

        })
        .catch((err) => {

            console.log(err);

            res.json({
                status: false,
                msg: "Error fetching dress types"
            });

        });
};

const searchTailors = (req, resp) => {
    const { city, category, dressType } = req.body;
    let query = {};

    // Build dynamic query based on what filters are provided
    if (city) {
        query.shopCity = city;
    }

    if (category) {
        query.category = category;
    }

    // Use regex for dressType to match strings inside the 'speciality' field
    // e.g., if speciality is "Jackets, Trousers", searching "Jackets" will match.
    if (dressType) {
        query.speciality = { $regex: dressType, $options: "i" };
    }

    tailorColRef
        .find(query)
        .then((docs) => {
            resp.status(200).json({
                status: true,
                msg: "Tailors fetched successfully",
                data: docs,
            });
        })
        .catch((err) => {
            console.error(err.message);
            resp.status(500).json({
                status: false,
                msg: "Error searching tailors",
            });
        });
};

module.exports = {
    doSignUp,
    doLogIn,
    custProfile,
    fetchCustomer,
    profUpdateCustomer,
    getTailorByMobile,
    addTailorReview,
    getCities,
    getDressTypes,
    searchTailors
};
