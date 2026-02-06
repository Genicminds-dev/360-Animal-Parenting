require('dotenv').config();

console.log('Testing email configuration...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password length:', process.env.EMAIL_PASS?.length || 0);

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email test failed:', error.message);
    console.log('Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n=== SOLUTION ===');
      console.log('1. Go to: https://myaccount.google.com/security');
      console.log('2. Click on "2-Step Verification"');
      console.log('3. Turn it ON');
      console.log('4. Go to "App passwords"');
      console.log('5. Select "Mail" and "Other"');
      console.log('6. Name it "Animal Parenting"');
      console.log('7. Copy the 16-character password');
      console.log('8. Update .env file EMAIL_PASS with new password');
    }
  } else {
    console.log('✅ Email test successful! Service is ready.');
  }
  process.exit();
});
