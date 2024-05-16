const mailer = require("../config/email.config");
const { newError } = require("../utils");

const sendResetLink = async (email, name, resetLink) => {
  try {
    const resetLinkTemplate = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
                background-color: #4CAF50;
                color: #ffffff;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 18px;
                color: #333333;
            }
            .reset-link {
                display: inline-block;
                margin: 20px 0;
                padding: 10px 20px;
                font-size: 18px;
                color: #ffffff;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 14px;
                color: #888888;
            }
            .footer p {
                margin: 5px 0;
            }
            @media (max-width: 600px) {
                .container {
                    width: 100%;
                    padding: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="${resetLink}" class="reset-link">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <p>This link will expire in 20 minutes.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Leyou exchange</p>
            </div>
        </div>
    </body>
    </html>
       `;

    await mailer(email, name, "Reset Link sent", resetLinkTemplate);
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const sendEmailVerificationOTP = async (email, OTP) => {
  try {
    const emailVerificationOTPTemplate = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #4CAF50;
                    color: #ffffff;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .content p {
                    font-size: 18px;
                    color: #333333;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4CAF50;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 14px;
                    color: #888888;
                }
                .footer p {
                    margin: 5px 0;
                }
                @media (max-width: 600px) {
                    .container {
                        width: 100%;
                        padding: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>OTP Verification</h1>
                </div>
                <div class="content">
                    <p>Hello there,</p>
                    <p>Thank you for your request. Please use the following One-Time Password (OTP) to proceed:</p>
                    <div class="otp">${OTP}</div>
                    <p>This OTP is valid for the next 20 minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Leyou exchange </p>
                </div>
            </div>
        </body>
        </html>
        `;

    const response = await mailer(
      email,
      email,
      `Your secure OTP is ${OTP}`,
      emailVerificationOTPTemplate
    );

    return response;
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

module.exports = {
  sendResetLink,
  sendEmailVerificationOTP,
};
