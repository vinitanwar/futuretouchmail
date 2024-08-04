const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5001;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'futuretouchs@gmail.com', 
    pass: 'ufvmdzzopesgubhg' 
  }
});

app.use(express.json());

// Route to handle file upload and email sending


app.post('/send-email', upload.single('file'), (req, res) => {
  const {  subject, text, S_name, S_email, skype_id, S_phone, message, start_time, service_type, budget_range } = req.body;

  const file = req.file;
  const filePath = file ? file.path : null;

  // Format the HTML email body
  const htmlContent = `
    <h2>Message Details</h2>
    <p><strong>Name:</strong> ${S_name}</p>
    <p><strong>Email:</strong> ${S_email}</p>
    <p><strong>Skype ID:</strong> ${skype_id}</p>
    <p><strong>Phone:</strong> ${S_phone}</p>
    <p><strong>Message:</strong> ${message}</p>
    <p><strong>Start Time:</strong> ${start_time}</p>
    <p><strong>Service Type:</strong> ${service_type}</p>
    <p><strong>Budget Range:</strong> ${budget_range}</p>
  `;

  // Define the email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: S_email,
    subject: subject,
    html: htmlContent,
    attachments: file ? [
      {
        filename: file.originalname,
        path: filePath
      }
    ] : []
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    // Remove the file after sending the email
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email');
    }

    console.log('Email sent:', info.response);
    res.send('Email sent successfully');
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
