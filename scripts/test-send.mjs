import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const user = process.env.EMAIL_USER || 'info@mura-homes.com';
const pass = process.env.EMAIL_APP_PASSWORD;
const port = parseInt(process.env.EMAIL_PORT || '465', 10);
const host = process.env.EMAIL_HOST || 'mail.privateemail.com';

console.log('--- EXPLICIT NODEMAILER TEST SCRIPT ---');
console.log('User:', user);
console.log('Host:', host);
console.log('Port:', port);
console.log('Pass Length:', pass ? pass.length : 0);
console.log('---------------------------------------');

// 1. Configure transporter dynamically
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // Automatically true for 465, false for 587
  auth: { user, pass }
});

// 2. Define email payload
const mailOptions = {
  from: `"MuraHomes" <${user}>`,
  to: 'info@mura-homes.com',
  subject: 'Welcome to Our Platform!',
  text: 'Hello! Thank you for joining us.',
  html: '<h1>Hello!</h1><p>Thank you for joining us.</p>'
};

// 3. Verify connection then send
async function send() {
  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ Connection verified! Sending email...');

    const info = await transporter.sendMail(mailOptions);
    console.log('🎉 Email sent successfully. Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}

send();