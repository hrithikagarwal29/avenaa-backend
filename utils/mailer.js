const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendLoginCredentials({ toEmail, ownerName, loginUrl, username, password }) {
  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to:      toEmail,
    subject: 'Welcome to Avenaa — Your Owner Account is Ready!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;padding:28px;border:1px solid #e5e7eb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:22px;font-weight:700;color:#1a5e1f;">avenaa</div>
          <div style="font-size:13px;color:#6b7280;">Brise Hospitality Management (OPC) Pvt Ltd</div>
        </div>
        <h2 style="color:#1a1a2e;font-size:18px;">Welcome aboard, ${ownerName}!</h2>
        <p style="color:#374151;font-size:14px;line-height:1.6;">Your property has been successfully onboarded with <strong>avenaa.co.in</strong>. Here are your login credentials:</p>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:4px 0;font-size:14px;"><strong>Username:</strong> ${username}</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Password:</strong> ${password}</p>
          <p style="margin:8px 0 0;font-size:14px;"><strong>Login:</strong> <a href="${loginUrl}" style="color:#15803d;">${loginUrl}</a></p>
        </div>
        <p style="color:#9ca3af;font-size:12px;">Please change your password after your first login. For support: support@avenaa.co.in</p>
        <p style="margin-top:20px;font-size:13px;color:#374151;">— Avenaa Team<br/>Brise Hospitality Management (OPC) Pvt Ltd<br/>Vaswani Chambers, Worli, Mumbai 400030</p>
      </div>
    `,
  });
}

module.exports = { sendLoginCredentials };
