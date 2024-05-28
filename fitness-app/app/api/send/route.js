import { sendEmail } from "../../../lib/sendEmail"

export async function POST(req) {
  try {
    const { name, email, message } = await req.json()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("message", message)

    await sendEmail(formData)
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
  })
}
