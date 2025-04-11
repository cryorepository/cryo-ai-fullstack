// utils/sendEmail.ts
import nodemailer, { Transporter } from 'nodemailer';

const sendEmail = async (email: string, code: number): Promise<void> => {
  try {
    if (!code || !email) {
      return;
    }

    const host: string | undefined = process.env.HOST;
    const port: string | undefined = process.env.EMAILPORT;
    const user: string | undefined = process.env.USEREMAIL;
    const pass: string | undefined = process.env.PASS;

    // Check if environment variables are defined
    if (!host || !port || !user || !pass) {
      throw new Error('Missing email configuration environment variables');
    }

    const transporter: Transporter = nodemailer.createTransport({
      host,
      port: parseInt(port), // Convert port to number
      secure: false,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: user,
      to: email,
      subject: 'Your OTP Code - CryoRepository AI',
      html: `
        <body>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              background-color: #f7f7f7;
              color: #0f172a;
            }
            .container {
              max-width: 560px;
              margin: 20px auto;
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
            }
            .header {
              padding: 16px;
              text-align: center;
              border-bottom: 1px solid #e2e8f0;
            }
            .content {
              padding: 24px;
              text-align: center;
            }
            .otp-box {
              display: inline-block;
              padding: 12px 24px;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              margin: 16px 0;
              font-size: 26px;
              font-weight: 600;
              letter-spacing: 6px;
              color: #0f172a;
              background-color: #f8fafc;
            }
            .footer {
              padding: 12px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
            }
            .warning {
              color: #ef4444;
              font-size: 13px;
              margin-top: 12px;
            }
            a {
              color: #3b82f6;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
          <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f7f7; padding: 20px;">
            <tr>
              <td align="center">
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 18px; font-weight: 600;">Your OTP Code</h1>
                  </div>
                  <div class="content">
                    <p>Your one time login code, this code is valid for 15 minutes</p>
                    <div class="otp-box">
                      ${code}
                    </div>
                  </div>
                  <div class="footer">
                    <p>© 2025 <a href="https://ai.cryorepository.com/">CRYOREPOSITORY</a></p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return;
  } catch (error) {
    console.error('Error sending email:', error);
    return;
  }
};

export default sendEmail;