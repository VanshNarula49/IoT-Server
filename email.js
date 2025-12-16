import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// AWS SES Configuration
const AWS_REGION = process.env.AWS_REGION ;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ;
const FROM_EMAIL = process.env.FROM_EMAIL ;

// Create SES client
const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Send an email using AWS SES
 * @param {Object} emailData - Email configuration
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.text - Plain text email body
 * @param {string} emailData.html - HTML email body (optional)
 * @param {string} emailData.from - Sender email address (optional, defaults to FROM_EMAIL)
 * @returns {Promise} SES send result
 */
export async function sendEmail(emailData) {
  const { to, subject, text, html, from = FROM_EMAIL } = emailData;

  const params = {
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
      },
    },
  };

  // Add HTML body if provided
  if (html) {
    params.Message.Body.Html = {
      Data: html,
      Charset: "UTF-8",
    };
  }

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response.MessageId);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

/**
 * Generate beautiful HTML email template for user credentials
 * @param {string} name - User name
 * @param {string} uid - User ID
 * @returns {string} HTML email template
 */
function generateCredentialsEmailTemplate(name, uid) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Robify IOT Platform</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(37, 49, 81, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #253151 0%, #1a2438 100%); padding: 50px 30px; text-align: center;">
                            <img src="http://iot.robify.in/logo.png" alt="Robify Logo" style="max-width: 180px; height: auto; margin-bottom: 20px;" />
                            <h1 style="margin: 15px 0 0 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">
                                ROBIFY IOT PLATFORM
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #253151; font-size: 26px; font-weight: 600;">
                                Welcome to Robify, ${name}! 🎉
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                                Congratulations! You have been successfully registered by Team Robify on the Robify IOT Platform. You're now ready to connect your IOT devices and explore endless possibilities.
                            </p>
                            
                            <!-- Device Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); border-radius: 10px; border-left: 5px solid #253151; margin: 30px 0; box-shadow: 0 2px 4px rgba(37, 49, 81, 0.08);">
                                <tr>
                                    <td style="padding: 30px;">
                                        <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Your Device Connection Code
                                        </p>
                                        <p style="margin: 0; color: #253151; font-size: 32px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                                            ${uid}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 25px 0 0 0; color: #4a5568; font-size: 14px; line-height: 1.7;">
                                <strong style="color: #253151;">🔐 Important:</strong> This unique code is required to connect your IOT devices to the Robify platform. Please keep it secure and do not share it with anyone.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Instructions Section -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 20px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 10px; border-left: 4px solid #253151;">
                                        <p style="margin: 0; color: #1e3a5f; font-size: 14px; line-height: 1.7;">
                                            <strong>🚀 Next Steps:</strong> Use this code to connect your IOT devices to the Robify platform. Once connected, you can participate in live IoT Workshops on the Robify Platform.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; text-align: center;">
                                Need assistance? Contact Team Robify
                            </p>
                            <p style="margin: 0; color: #718096; font-size: 12px; text-align: center;">
                                © 2025 Robify IOT Platform. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Bottom Spacing -->
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                                You received this email because you were registered by Team Robify.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

/**
 * Send email with user credentials
 * @param {string} email - Recipient email address
 * @param {string} name - User name
 * @param {string} uid - User ID
 * @returns {Promise} SES send result
 */
export async function sendUserCredentialsEmail(email, name, uid) {
  const htmlContent = generateCredentialsEmailTemplate(name, uid);
  const textContent = `Hello ${name},\n\nWelcome to Robify IOT Platform!\n\nCongratulations! You have been successfully registered by Team Robify on the Robify IOT Platform.\n\nYour Device Connection Code is: ${uid}\n\nThis unique code is required to connect your IOT devices to the Robify platform. Please keep it secure and do not share it with anyone.\n\nNeed assistance? Contact Team Robify.\n\n© 2025 Robify IOT Platform. All rights reserved.`;
  
  return sendEmail({
    to: email,
    subject: "🎉 Welcome to Robify IOT Platform - Your Device Connection Code",
    text: textContent,
    html: htmlContent,
  });
}

/**
 * Send bulk emails to multiple users
 * @param {Array} users - Array of user objects with email, name, and uid
 * @returns {Promise<Array>} Array of results
 */
export async function sendBulkEmails(users) {
  const results = [];
  
  for (const user of users) {
    try {
      const result = await sendUserCredentialsEmail(
        user.email,
        user.name,
        user.uid
      );
      results.push({ success: true, email: user.email, result });
    } catch (error) {
      results.push({ success: false, email: user.email, error });
    }
  }
  
  return results;
}

export default {
  sendEmail,
  sendUserCredentialsEmail,
  sendBulkEmails,
};
