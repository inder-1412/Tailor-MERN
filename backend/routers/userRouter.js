var express = require('express');
var userController = require("../controller/userController");
var {validateTokenn2} = require("../config/validateToken");

var router = express.Router();


router.post("/signUp",userController.doSignUp);
router.post("/logIn",userController.doLogIn);

router.post("/customerProfile",validateTokenn2 ,userController.custProfile);
router.post("/fetchCustomerProf",validateTokenn2,userController.fetchCustomer);
router.post("/customerProfUpdate",validateTokenn2, userController.profUpdateCustomer);
router.post("/getByMobile", validateTokenn2, userController.getTailorByMobile);
router.post("/addReview", validateTokenn2, userController.addTailorReview);

router.post("/cities", userController.getCities);
router.post("/dressTypes", userController.getDressTypes);
router.post("/searchTailors", userController.searchTailors);


module.exports = router;