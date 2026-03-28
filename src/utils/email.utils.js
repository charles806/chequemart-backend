import { createTransport } from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = parseInt(process.env.SMTP_PORT || "587");
    transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
};

/**
 * sendEmail - Generic email sender (fails silently if SMTP not configured)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const mailTransporter = getTransporter();
  
  if (!mailTransporter) {
    console.warn("⚠️ Email transporter not configured. Skipping email send.");
    console.log("SMTP check:", { 
      SMTP_HOST: process.env.SMTP_HOST, 
      SMTP_USER: process.env.SMTP_USER ? "present" : "missing",
      SMTP_PASS: process.env.SMTP_PASS ? "present" : "missing"
    });
    return null;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    };
    console.log("📧 Sending email to:", to, "Subject:", subject);
    console.log("📧 SMTP config:", { host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, user: process.env.SMTP_USER });
    const info = await mailTransporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("⚠️ Failed to send email:", error.message);
    console.error("⚠️ SMTP Error details:", error);
    return null;
  }
};

export const sendVerificationEmail = async (to, name, token) => {
  const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  return sendEmail({
    to,
    subject: "Verify your Chequemart account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Welcome to Chequemart, ${name}! 🎉</h2>
        <p>Thanks for signing up. Please verify your email address to activate your account.</p>
        <a href="${verifyURL}"
          style="display:inline-block; padding:12px 24px; background:#4f46e5; color:#fff;
                 text-decoration:none; border-radius:6px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color:#888; font-size:13px;">This link expires in 24 hours.</p>
        <p style="color:#888; font-size:13px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to, name, token) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  return sendEmail({
    to,
    subject: "Reset your Chequemart password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${resetURL}"
          style="display:inline-block; padding:12px 24px; background:#dc2626; color:#fff;
                 text-decoration:none; border-radius:6px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color:#888; font-size:13px;">This link expires in 1 hour.</p>
        <p style="color:#888; font-size:13px;">If you didn't request this, your password won't be changed.</p>
      </div>
    `,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
