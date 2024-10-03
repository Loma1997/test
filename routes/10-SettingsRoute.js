const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Mailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const transporter = Mailer.createTransport({
    service: 'gmail',
    auth: {
        user: "loma2598@gmail.com",
        pass: "j t z s y v s j w a i v k y c s",
    }
});

require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../controllers/Msg");
const User = require("../models/UserSchema");
const Admin = require("../models/AdminSchema");

// GET REQUEST
router.get("/Settings", RequireAuth, (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    Admin.findOne({ _id: Decode.ID })
        .then((Data) => { res.render("21-Settings", { MainData: Data, User: Decode, Title: "الاعدادات" }); })
        .catch((err) => { console.log(err); });
});

// EDIT PersonalData
router.post("/PersonalDataSettings", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    try {
        await Admin.updateOne({ _id: Decode.ID },
            {
                Username: req.body.Username,
                Phone: req.body.Phone,
                Email: req.body.Email,
                Address: req.body.Address,
            }
        );

        let Code = {
            ID: Decode.ID,
            UserID: Decode.UserID,
            Username: req.body.Username,
            Email: req.body.Email,
            Phone: req.body.Phone,
            Address: req.body.Address,
            Password: Decode.Password,
            VoiceMessage: Decode.VoiceMessage,
            Notfications: Decode.Notfications,
            DarkMood: Decode.DarkMood,
            TypeUser: Decode.TypeUser,
            Permissions: Decode.Permissions,
        }

        let token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json(Msg.Edit);
    }
    catch (error) { console.log(error); }
});

// EDIT Email
let PersonalData = {}, CodeTxt = '';
router.post("/EmailSettings", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let isCurrentEmail;
    try {
        isCurrentEmail = await Admin.findOne({ Email: req.body.Email });
        if (isCurrentEmail) { return res.json(Msg.ExistEmail); }

        // Create Random Code and Sent Email
        CodeTxt = ''
        const hexString = "0123456789"
        for (let i = 0; i < 6; i++) { CodeTxt += hexString[Math.floor(Math.random() * hexString.length)] }

        const EmailObj = {
            from: req.body.Email,
            to: req.body.Email,
            subject: 'Verification Email',
            html: `${Msg.DesignGamilMsg}
            <div class="DetailsMsg">
                <p>عزيزي ${req.body.Username}</p>
                <p>لقد تلقينا طلبًا لتعديل البريد الالكتروني الخاص بك </p>
                <p>يرجي استخدام الكود التالي لتأكيد حسابك </p>
                <h3>${CodeTxt}</h3>
            </div></div></body></html>`
        };

        let SendMail = await transporter.sendMail(EmailObj)
        if (SendMail) {
            PersonalData = {
                Username: req.body.Username,
                Phone: req.body.Phone,
                Email: req.body.Email,
                Address: req.body.Address,
            }
            console.log(CodeTxt)
            res.json(Msg.SendMail);
        } else {
            res.json(Msg.NotSendMail);
        }
    }
    catch (error) { console.log(error); }
});

router.post("/ConfirmEmailSettings", async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    try {
        if (req.body.CodeTxt === CodeTxt) {
            await Admin.updateOne({ _id: Decode.ID },
                {
                    Username: PersonalData.Username,
                    Phone: PersonalData.Phone,
                    Email: PersonalData.Email,
                    Address: PersonalData.Address,
                }
            );

            let Code = {
                ID: Decode.ID,
                UserID: Decode.UserID,
                Username: PersonalData.Username,
                Email: PersonalData.Email,
                Phone: PersonalData.Phone,
                Address: PersonalData.Address,
                Password: Decode.Password,
                VoiceMessage: Decode.VoiceMessage,
                Notfications: Decode.Notfications,
                DarkMood: Decode.DarkMood,
            }

            let token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
            res.json(Msg.Edit);
        }
        else {
            res.json(Msg.WrongCode)
        }
    }
    catch (error) { console.log(error); }
});

// EDIT Password
router.post("/PasswordSettings", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    const match = await bcrypt.compare(req.body.Password, Decode.Password);
    if (!match) { return res.json(Msg.WrongPass); }
    if (req.body.NewPassword != req.body.ConfirmPassword) { return res.json(Msg.WrongConfirm); }

    let HashedPassword = bcrypt.hashSync(req.body.NewPassword, 10)

    try {
        await Admin.updateOne({ _id: Decode.ID },
            { Password: HashedPassword }
        );

        let Code = {
            ID: Decode.ID,
            UserID: Decode.UserID,
            Username: Decode.Username,
            Email: Decode.Email,
            Phone: Decode.Phone,
            Address: Decode.Address,
            Password: HashedPassword,
            VoiceMessage: Decode.VoiceMessage,
            Notfications: Decode.Notfications,
            DarkMood: Decode.DarkMood,
        }
        let token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json(Msg.Edit);
    }
    catch (error) { console.log(error); }
});

// EDIT CompanyData
router.post("/CompanyDataSettings", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    try {
        await Admin.updateOne({ _id: Decode.ID },
            {
                NameCompany: req.body.NameCompany,
                TypeCompany: req.body.TypeCompany,
                CityCompany: req.body.CityCompany,
                AddressCompany: req.body.AddressCompany,
                PhoneCompany1: req.body.PhoneCompany1,
                PhoneCompany2: req.body.PhoneCompany2,
            }
        );
        res.json(Msg.Edit);
    }
    catch (error) { console.log(error); }
});

// EDIT Settings
router.post("/Settings", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    try {
        await Admin.updateOne({ _id: Decode.ID },
            {
                VoiceMessage: req.body.VoiceMessage,
                Notfications: req.body.Notfications,
                DarkMood: req.body.DarkMood,
            }
        );

        let Code = {
            ID: Decode.ID,
            UserID: Decode.UserID,
            Username: Decode.Username,
            Email: Decode.Email,
            Phone: Decode.Phone,
            Address: Decode.Address,
            Password: Decode.Password,
            VoiceMessage: req.body.VoiceMessage,
            Notfications: req.body.Notfications,
            DarkMood: req.body.DarkMood,
        }
        let token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json(Msg.Edit);
    }
    catch (error) { console.log(error); }
});

module.exports = router;