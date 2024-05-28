"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (formData: FormData) => {
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")
  console.log(formData.get("message"))

  if (
    !name ||
    !email ||
    !message ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return
  }

  await resend.emails.send({
    from: "Contact <onboarding@resend.dev> ",
    to: "chelgowac@gmail.com",
    subject: "Message from Contact Form",
    reply_to: email,
    text: message as string,
  })
}
