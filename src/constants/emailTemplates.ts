/**
 * Email Templates for User Notifications
 *
 * This module provides HTML email templates for various user-related notifications,
 * including email confirmation, welcome messages, and password reset instructions.
 * Templates use the {{code}} placeholder for dynamic insertion of verification codes.
 *
 * Templates:
 * - confirmEmail: Sent to users to verify their email address during registration.
 * - welcomeEmail: Sent to users after successful registration and verification.
 * - resetPasswordEmail: Sent to users who request a password reset.
 *
 * Usage:
 *   Replace the {{code}} placeholder with the actual verification or reset code
 *   before sending the email.
 *
 * @module constants/emailTemplates
 */

export const emailTemplates = {
  /**
   * confirmEmail
   * HTML template for email verification.
   * @param code - The verification code to be inserted into the template.
   */
  confirmEmail: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #007bff;
          color: white;
        }
        .content {
          padding: 20px;
          color: #333333;
        }
        .verification-code {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 5px;
          margin: 20px 0;
          letter-spacing: 2px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirm Your Email</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for signing up! To complete your registration and verify your email address, please use the following verification code:</p>
          <div class="verification-code">{{code}}</div>
          <p>This verification code will expire in 5 minutes.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; 2024 GTA Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * welcomeEmail
   * HTML template for welcoming new users.
   */
  welcomeEmail: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to {your-website name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #007bff;
          color: white;
        }
        .content {
          padding: 20px;
          color: #333333;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to GTA Academy!</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Welcome to GTA Academy! We're excited to have you join our community.</p>
          <p>Your account has been successfully created and verified. You can now access all the features and resources available on our platform.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The GTA Academy Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; 2024 GTA Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * resetPasswordEmail
   * HTML template for password reset instructions.
   * @param code - The reset code to be inserted into the template.
   */
  resetPasswordEmail: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #007bff;
          color: white;
        }
        .content {
          padding: 20px;
          color: #333333;
        }
        .verification-code {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 5px;
          margin: 20px 0;
          letter-spacing: 2px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password. Please use the following code to reset your password:</p>
          <div class="verification-code">{{code}}</div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; 2024 GTA Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
