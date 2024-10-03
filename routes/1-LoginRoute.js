const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mailer = require('nodemailer');

const transporter = Mailer.createTransport({
  service: 'gmail',
  auth: {
    user: "loma2598@gmail.com",
    pass: "j t z s y v s j w a i v k y c s",
  }
});
require('dotenv').config()

const { RequireAuth, UnRequireAuth, CheckIfUser } = require("../middleware/middleware");
const User = require("../models/UserSchema");
const Admin = require("../models/AdminSchema");
const Msg = require("../controllers/Msg");

router.get("/", UnRequireAuth, (req, res) => {
  res.render("Auth/Login", { Title: "Login" });
});

router.get("/Login", UnRequireAuth, (req, res) => {
  res.render("Auth/Login", { Title: "Login" });
});

router.get("/Activation", (req, res) => {
  res.render("Auth/Activation", { Title: "Activation" });
});

router.get("/ForgotPassword", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.render("Auth/ForgotPassword", { Title: "ForgotPassword" })
})

router.post("/Login", async (req, res) => {
  let CheckUser, UserData, TypeUser, Permissions = [];
  try {
    CheckUser = await Admin.findOne({ Email: req.body.Email });
    if (CheckUser) { UserData = CheckUser }
    if (!CheckUser) { return res.json([Msg.WrongEmail]) }

    const match = await bcrypt.compare(req.body.Password, UserData.Password);
    if (!match) { return res.json([Msg.WrongEmail]); }

    let Code = {
      ID: CheckUser._id,
      Username: UserData.Username,
      Email: UserData.Email,
      Phone: UserData.Phone,
      Address: UserData.Address,
      Password: UserData.Password,
      VoiceMessage: UserData.VoiceMessage,
      Notfications: UserData.Notfications,
      DarkMood: UserData.DarkMood,
    }

    let token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 43200000 });
    res.json([Msg.Success])
  }
  catch (error) { console.log(error); }
});

// Create Random Code and Sent Email then redirect to ResetPassword
let ForgotObj = { ID: "", }
router.post("/ForgotPassword", async (req, res) => {
  let CheckUser; let TypeUser; let UserData; let CodeTxt = '';
  try {
    CheckUser = await Admin.findOne({ Email: req.body.Email });
    if (CheckUser) { UserData = CheckUser; }
    if (!CheckUser) { return res.json([Msg.WrongEmail]) }

    const hexString = "0123456789"
    for (let i = 0; i < 6; i++) {
      CodeTxt += hexString[Math.floor(Math.random() * hexString.length)]
    }
    const EmailObj = {
      from: req.body.Email,
      to: req.body.Email,
      subject: 'Verification Email',
      html: `${Msg.DesignGamilMsg}
      <div class="DetailsMsg">
          <p>عزيزي ${UserData.Username}</p>
          <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك</p>
          <p>أدخل رمز إعادة تعيين كلمة المرور التالي</p>
          <h3>${CodeTxt}</h3>
      </div>
      <div class="Note">
            <span>اذا لم تكن انت تجاهل ذلك !</span>
        </div>
      </div></body></html>`
    };

    let SendMail = await transporter.sendMail(EmailObj)
    if (SendMail) {
      ForgotObj = {
        ID: UserData._id,
        CodeTxt: CodeTxt,
        TypeUser: TypeUser,
      }
      console.log(CodeTxt)
      res.json([Msg.SendMail]);
    } else {
      res.json([Msg.NotSendMail]);
    }
  }
  catch (error) { console.log(error); }
})

// Check If CodeTxt True redirect to NewPassword
router.post("/ResetPassword", async (req, res) => {
  try {
    if (req.body.CodeTxt === ForgotObj.CodeTxt) { res.json([Msg.Success]); }
    else { res.json([Msg.WrongCode]) }
  }
  catch (error) { console.log(error); }
});

router.post("/NewPassword", async (req, res) => {
  let HashedPassword = bcrypt.hashSync(req.body.Password, 10)
  console.log(req.body.Password, ForgotObj.TypeUser)
  try {
    await Admin.updateOne({ _id: ForgotObj.ID },
      { Password: HashedPassword }
    );

    res.json([Msg.Success]);
  }
  catch (error) { console.log(error); }

});


module.exports = router;