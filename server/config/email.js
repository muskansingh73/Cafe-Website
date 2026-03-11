const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templates = {
  reservationConfirm: (data) => ({
    subject: `Reservation Confirmed – Maison Dorée`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:32px;color:#3D2B1F;font-weight:300;margin:0;">Maison <span style="color:#C9A84C">Dorée</span></h1>
          <p style="color:#8A7E74;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Fine Dining · Mumbai</p>
        </div>
        <div style="background:#FFFFFF;border:1px solid #DDD5C8;border-radius:4px;padding:40px;">
          <h2 style="color:#3D2B1F;font-weight:300;font-size:24px;margin-top:0;">Reservation Confirmed ✓</h2>
          <p style="color:#8A7E74;line-height:1.7;">Dear <strong style="color:#1C1C1A">${data.name}</strong>, your table has been reserved.</p>
          <div style="background:#F5EFE4;border-radius:4px;padding:24px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#8A7E74;font-size:13px;">Date</td><td style="padding:8px 0;font-weight:500;color:#1C1C1A;">${data.date}</td></tr>
              <tr><td style="padding:8px 0;color:#8A7E74;font-size:13px;">Time</td><td style="padding:8px 0;font-weight:500;color:#1C1C1A;">${data.time}</td></tr>
              <tr><td style="padding:8px 0;color:#8A7E74;font-size:13px;">Guests</td><td style="padding:8px 0;font-weight:500;color:#1C1C1A;">${data.guests}</td></tr>
              ${data.note ? `<tr><td style="padding:8px 0;color:#8A7E74;font-size:13px;">Note</td><td style="padding:8px 0;font-weight:500;color:#1C1C1A;">${data.note}</td></tr>` : ""}
            </table>
          </div>
          <p style="color:#8A7E74;font-size:13px;line-height:1.7;">Need to modify? Call us at <strong style="color:#3D2B1F">+91 22 4567 8900</strong></p>
        </div>
        <p style="text-align:center;color:#8A7E74;font-size:12px;margin-top:24px;">12 Marine Drive, South Mumbai · hello@maisondoree.in</p>
      </div>
    `,
  }),

  orderConfirm: (data) => ({
    subject: `Order #${data.orderId} Confirmed – Maison Dorée`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:32px;color:#3D2B1F;font-weight:300;margin:0;">Maison <span style="color:#C9A84C">Dorée</span></h1>
        </div>
        <div style="background:#FFFFFF;border:1px solid #DDD5C8;border-radius:4px;padding:40px;">
          <h2 style="color:#3D2B1F;font-weight:300;font-size:24px;margin-top:0;">Order Confirmed 🛵</h2>
          <p style="color:#8A7E74;">Order <strong style="color:#1C1C1A">#${data.orderId}</strong> is being prepared.</p>
          <div style="background:#F5EFE4;border-radius:4px;padding:24px;margin:24px 0;">
            ${data.items.map(i => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #DDD5C8;">
                <span>${i.name} × ${i.qty}</span>
                <span style="font-weight:500;">₹${i.price * i.qty}</span>
              </div>
            `).join("")}
            <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-weight:600;">
              <span>Total</span>
              <span>₹${data.total}</span>
            </div>
          </div>
          <p style="color:#8A7E74;font-size:13px;">Estimated delivery: <strong style="color:#1C1C1A">35–45 minutes</strong></p>
        </div>
      </div>
    `,
  }),

  adminNewReservation: (data) => ({
    subject: `New Reservation – ${data.name} (${data.date})`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;">
        <h2 style="color:#3D2B1F;">New Reservation Request</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Guest</td><td style="padding:8px;">${data.name}</td></tr>
          <tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Email</td><td style="padding:8px;">${data.email}</td></tr>
          <tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Phone</td><td style="padding:8px;">${data.phone}</td></tr>
          <tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Date</td><td style="padding:8px;">${data.date}</td></tr>
          <tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Time</td><td style="padding:8px;">${data.time}</td></tr>
          <tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Guests</td><td style="padding:8px;">${data.guests}</td></tr>
          ${data.note ? `<tr><td style="padding:8px;background:#FAF7F2;font-weight:500;">Note</td><td style="padding:8px;">${data.note}</td></tr>` : ""}
        </table>
      </div>
    `,
  }),
};

async function sendEmail(to, templateName, data) {
  try {
    const { subject, html } = templates[templateName](data);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent: ${templateName} → ${to}`);
  } catch (err) {
    console.error(`❌ Email failed: ${err.message}`);
  }
}

module.exports = { sendEmail };