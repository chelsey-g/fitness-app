import { Resend } from "resend"

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

export const sendEmail = async (formData) => {
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
    text: message,
  })
}
