var tailorColRef = require("../models/modelTailor");
var Tesseract = require("tesseract.js");

const path = require("path");

const tailorPersonalDetails = (req, resp) => {
    console.log("hit");

    let fileName = req.files.profilepic.name;
    let uploadFolderPath = path.join(__dirname, "..", "uploads", fileName);
    req.files.profilepic.mv(uploadFolderPath);
    req.body.filePath = uploadFolderPath;

    // req.body.dos = new Date().toString();

    //-------IMPORTANT NAME SHOULD BE SAME AS IN MODEL WE DECLARED ----------
    req.body.profilepic = fileName;
    // uploadImage(uploadFolderPath);

    let objUserColRef = new tailorColRef(req.body);
    objUserColRef
        .save()
        .then((doc) => {
            console.log(doc);
            resp.status(200).json({
                status: true,
                msg: "Personal Record saved.",
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

const tailorProfessionalDetails = async (req, resp) => {
    console.log("hit2");

    const existingTailor = await tailorColRef.findOne({
        email: req.body.email,
    });

    if (!existingTailor) {
        return resp.status(404).json({
            status: false,
            msg: "Tailor not found. Please complete personal details first.",
        });
    }

    const updatedTailor = await tailorColRef.findOneAndUpdate(
        { email: req.body.email },
        {
            $set: {
                category: req.body.category,
                speciality: req.body.speciality,
                socialLink: req.body.socialLink,
                workingSince: req.body.workingSince,
                workType: req.body.workType,
                shopAddress: req.body.shopAddress,
                shopCity: req.body.shopCity,
                otherInfo: req.body.otherInfo,
            },
        },
        { new: true },
    );

    resp.status(200).json({
        status: true,
        msg: "Professional Record saved.",
        doc: updatedTailor,
    });
};

const extractAadharDetails = (req, resp) => {
    if (!req.files || !req.files.aadharFile) {
        return resp.status(400).json({
            status: false,
            msg: "No Aadhaar file uploaded",
        });
    }

    const aadharFile = req.files.aadharFile;

    Tesseract.recognize(aadharFile.data, "eng+hin")
        .then(({ data: { text } }) => {
            console.log("OCR TEXT:", text);

            // 🔹 Extract Aadhaar Number (12 digits)
            const aadharMatch = text.match(/\d{4}\s?\d{4}\s?\d{4}/);
            const aadharNumber = aadharMatch
                ? aadharMatch[0].replace(/\s/g, "")
                : null;

            // 🔹 Extract DOB (dd/mm/yyyy or dd-mm-yyyy)
            const dobMatch = text.match(/\d{2}[\/-]\d{2}[\/-]\d{4}/);
            const dob = dobMatch ? dobMatch[0] : null;

            // 🔹 Extract Gender
            let gender = null;

            if (/female/i.test(text)) {
                gender = "female";
            } else if (/male/i.test(text)) {
                gender = "male";
            }

            resp.status(200).json({
                status: true,
                aadharNumber,
                dob,
                gender,
            });
        })
        .catch((err) => {
            console.error(err);
            resp.status(500).json({
                status: false,
                msg: "OCR extraction failed",
            });
        });
};

const fetchPersonalInfo = (req, resp) => {

    tailorColRef.findOne({ email: req.body.email })
        .select("+aadharNumber") // because you set select:false
        .then((doc) => {

            if (!doc) {
                return resp.status(200).json({
                    status: false,
                    msg: "No record found",
                });
            }

            resp.status(200).json({
                status: true,
                doc: doc,
            });

        })
        .catch((err) => {
            resp.status(500).json({
                status: false,
                msg: err.message,
            });
        });
};

const fetchProfessionalInfo = (req, resp) => {

    tailorColRef
        .findOne({ email: req.body.email })
        .then((doc) => {
            if (!doc) {
                return resp.status(200).json({
                    status: false,
                    msg: "No professional info found",
                });
            }

            resp.status(200).json({
                status: true,
                doc: doc,
            });
        })
        .catch((err) => {
            resp.status(500).json({
                status: false,
                msg: err.message,
            });
        });
};

module.exports = {
    tailorPersonalDetails,
    tailorProfessionalDetails,
    extractAadharDetails,
    fetchPersonalInfo,
    fetchProfessionalInfo
    
};
