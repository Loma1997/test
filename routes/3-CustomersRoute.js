const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../controllers/Msg");
const User = require("../models/UserSchema");
const Admin = require("../models/AdminSchema");

// GET REQUEST
router.get("/CustomersData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("1-Customers", { User: Decode, Title: "العملاء", Buttons: "TRUE", })
});

router.get("/CustomersReport", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("3-CustomersReport", { User: Decode, Title: "تقرير العملاء", Buttons: "FALSE", })
});

// EDIT AND GET REQUEST
router.put("/CollectFromCustomer:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne({ _id: req.params.id },
    { ActiveAT: new Date(), },
  )

  await User.updateOne({ _id: req.params.id }, {
    $push:
    {
      NotificationsData: {
        Username: "MARKET", Text: "تم تفعيل حسابك", Icon: "bx bx-bell", CreatedAt: new Date(),
      },
    },
  },
  )

  await Admin.updateOne({ _id: Decode.ID }, {
    $push:
    {
      GeneralData: {
        DocDate: req.body.DocDate,
        Name: req.body.Name,
        Total: req.body.Total,
        PaymentWay: req.body.PaymentWay,
        CreatedAt: new Date(),
      }
    }
  })
    .then((Data) => { return res.json(MyMsg = Msg.Edit) })
    .catch(err => { return MyMsg = Msg.Error })
});

module.exports = router;