import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { emailTemplates } from "../constants/emailTemplates";

interface ContentI {
  confirm_email: {
    subject: string;
    html: string;
  };

  welcome_email: {
    subject: string;
    html: string;
  };
}

// Load environment variables
dotenv.config();

// Create a transporter object
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  name: "GTA",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const mailOption = (
  user_mail: string,
  subject: string,
  content: string
) => {
  return {
    from: process.env.GMAIL_USER,
    to: user_mail,
    subject: subject,
    html: content,
  };
};

export const content = {
  confirm_email: {
    subject: "Confirm your email",
    html: emailTemplates.confirmEmail,
  },

  welcome_email: {
    subject: "Welcome to GTA Academy",
    html: emailTemplates.welcomeEmail,
  },
};
