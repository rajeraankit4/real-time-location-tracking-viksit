import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";


console.log("Loaded EMAIL_USER =", process.env.EMAIL_USER);
console.log("Loaded EMAIL_PASS =", process.env.EMAIL_PASS);

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your gmail
    pass: process.env.EMAIL_PASS       // app password (not gmail password)
  }
});
