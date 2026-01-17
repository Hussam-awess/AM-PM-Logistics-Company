import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { to, subject, html } = await req.json()

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"AM-PM Company Ltd" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  })

  return Response.json({ success: true })
}
