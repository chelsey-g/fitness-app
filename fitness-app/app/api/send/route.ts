import { NextApiRequest, NextApiResponse } from "next"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (formData: FormData) => {
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  if (
    !name ||
    !email ||
    !message ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    throw new Error("Invalid input")
  }

  await resend.emails.send({
    from: "Contact <onboarding@resend.dev>",
    to: "chelgowac@gmail.com",
    subject: "Message from Contact Form",
    reply_to: email,
    text: message as string,
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const formData = new FormData()
      formData.append("name", req.body.name)
      formData.append("email", req.body.email)
      formData.append("message", req.body.message)

      await sendEmail(formData)
      res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
