const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Ensure you configure the transport service properly.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Add your email address here
    pass: process.env.EMAIL_PASS, // Add your email password here
  },
});

exports.sendPDF = async (req, res) => {
  const { email } = req.body;
  const filePath = req.file.path;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Transfer Certificate',
    text: 'Please find your transfer certificate attached.',
    attachments: [
      {
        filename: 'certificate.pdf',
        path: filePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    fs.unlinkSync(filePath); // Remove file after sending
    res.status(200).send('PDF sent successfully');
  } catch (error) {
    res.status(500).send('Failed to send PDF');
  }
};
