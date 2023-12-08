import type { NextApiRequest, NextApiResponse } from "next";
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

const API_KEY = process.env.MAILGUN_API_KEY || '';
const DOMAIN = process.env.MAILGUN_DOMAIN || '';
const EMAIL_ADDRESS = process.env.NEXT_PUBLIC_EMAIL_ADDRESS || '';

const { name, email, message } = req.body

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});

const messageData = {
  from: 'Contact Form <contact@patrickrush.tech>',
  to: EMAIL_ADDRESS,
  subject: `New Message from ${name}`,
  text: `
    Message from ${name} (${email}):

    ${message}
  `
};

try {
  const emailResponse = await client.messages.create(DOMAIN, messageData)
  console.log("Email response:", emailResponse)
} catch (err) {
  console.log("Error sending email:", err)
  return res.status(500).json({ message: err });
}

  return res.status(200).json({ message: "Success" });
}