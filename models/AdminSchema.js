const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  Username: String,
  Phone: String,
  Email: String,
  Address: String,
  Password: String,
  VoiceMessage: { type: String, default: "false" },
  Notfications: { type: String, default: "true" },
  DarkMood: { type: String, default: "false" },

  NameCompany: String,
  TypeCompany: String,
  LogoCompany: { data: Buffer, contentType: String },
  CityCompany: String,
  AddressCompany: String,
  PhoneCompany1: String,
  PhoneCompany2: String,

  CreatedAt: Date,
  UpdatedAt: { type: Date, default: Date.now },

  //  Notfications Array
  NotificationsData: [{
    Username: String,
    Text: String,
    Icon: String,
    CreatedAt: { type: Date, default: Date.now },
  },],

  GeneralData: [{
    DocDate: String,
    Name: String,
    Total: Number,
    PaymentWay: String,
    CreatedAt: Date,
    Status: { type: String, default: "TRUE" },
    UpdatedAt: { type: Date, default: Date.now },
  },],

});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const Admin = mongoose.model("Admin", UserSchema);
module.exports = Admin;
