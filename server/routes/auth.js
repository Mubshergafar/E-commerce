const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Resquestmiddleware = require("../middleware/Resquestmiddleware");
const UserHelper = require("../helper/UserHelper");

//REGISTER
router.post(
  "/register",
  Resquestmiddleware.registerMiddleware,
  async (req, res) => {
    //creating user object based on the defined user schema
    const isUserInDB = await UserHelper.verifyUser(req.body.username);

    console.log(isUserInDB);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      //hashing the password to be stored in the DB
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });

    try {
      //saving the user to the DB
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json("cannot save user");
    }
  }
);

//Sign In

router.post("/login", Resquestmiddleware.loginMiddleware, async (req, res) => {
  try {
    // finding the user
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");

    // decrypting  the password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    //comparing the decripted password with the entered password
    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    // Creating web token ,after the login process
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    //distracturing the password to excloude it from the object which gonna be sent for the front end
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
