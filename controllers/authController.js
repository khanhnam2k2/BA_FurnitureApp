const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString(),
      location: req.body.location,
    });
    try {
      await newUser.save();
      res.status(201).json({ message: "User successfully created" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).populate(
        "favoriteProducts"
      );
      if (!user) {
        return res.status(401).json("Wrong credentials provide a valid email");
      }

      const decryptedPassword = CryptoJs.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decryptedpass = decryptedPassword.toString(CryptoJs.enc.Utf8);

      if (decryptedpass !== req.body.password) {
        res.status(401).json("Wrong email");
      }

      const userToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SEC,
        { expiresIn: "7d" }
      );

      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;
      res.status(200).json({ ...userData, token: userToken });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};
