const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "abuzarkhan1242@gmail.com", 
      pass: "qqby rsec hgwh rxfw", 
    },
  });

const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: "abuzarkhan1242@gmail.com",
      to: email,
      subject: 'Login OTP Verification',
      html: `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Reset styles for email clients */
        body, p, h1, h2, div {
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
            background-color: #111827; /* bg-gray-900 */
            color: #F3F4F6; /* text-gray-100 */
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .card {
            background-color: #1F2937; /* bg-gray-800 */
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 24px;
        }

        .title {
            color: #FFFFFF;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #9CA3AF; /* text-gray-400 */
            font-size: 16px;
            margin-bottom: 24px;
        }

        .otp-container {
            background-color: #374151; /* bg-gray-700 */
            border: 1px solid #4B5563; /* border-gray-600 */
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
        }

        .otp-code {
            color: #60A5FA; /* text-blue-400 */
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
        }

        .info {
            color: #9CA3AF; /* text-gray-400 */
            font-size: 14px;
            text-align: center;
            margin-top: 24px;
        }

        .footer {
            text-align: center;
            margin-top: 32px;
            color: #6B7280; /* text-gray-500 */
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1 class="title">Welcome Back!</h1>
                <p class="subtitle">Here's your one-time verification code</p>
            </div>

            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>

            <p class="info">
                This code will expire in 5 minutes.<br>
                If you didn't request this code, please ignore this email.
            </p>

            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendOTP };