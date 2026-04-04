var express = require('express');
var userController = require("../controller/userController")

var router = express.Router();


router.post("/signUp",userController.doSignUp);
router.post("/logIn",userController.doLogIn);

router.post("/customerProfile",userController.custProfile);
router.post("/fetchCustomerProf",userController.fetchCustomer);
router.post("/customerProfUpdate",userController.profUpdateCustomer);
router.post("/getByMobile", userController.getTailorByMobile);
router.post("/addReview", userController.addTailorReview);

router.post("/cities", userController.getCities);
router.post("/dressTypes", userController.getDressTypes);
router.post("/searchTailors", userController.searchTailors);


module.exports = router;