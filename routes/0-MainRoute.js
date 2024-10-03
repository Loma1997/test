const express = require("express");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth, UnRequireAuth, CheckIfUser } = require("../middleware/middleware");
const User = require("../models/UserSchema");
const Admin = require("../models/AdminSchema");

router.get("*", CheckIfUser);
router.post("*", CheckIfUser);
router.put("*", CheckIfUser);
router.delete("*", CheckIfUser);

router.get("/DATA.JSON", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await Admin.findOne({ _id: Decode.ID })
    .then((MainData) => { res.json(MainData) })
    .catch((error) => { console.log(error); });
});

router.get("/Notfications.JSON", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await Admin.findOne({ _id: Decode.ID })
    .then((MainData) => { res.json([MainData, Decode]) })
    .catch((error) => { console.log(error); });
});

router.get("/USERDATA.JSON", RequireAuth, async (req, res) => {
  await User.find()
    .then((MainData) => { res.json(MainData) })
    .catch((error) => { console.log(error); });
});

router.get("/Home", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("0-Home", { User: Decode, moment: moment, Title: "Home" });
});

router.get("/SignOut", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/Login");
});

router.get("/Error", (req, res) => {
  res.render("Auth/Error", { Title: "Error" });
});

module.exports = router;
