import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  console.log("API route hit: /api/send-invitation")

  try {
    const { email, inviteUrl, inviterName } = await request.json()

    console.log("Request data:", {
      email,
      inviteUrl,
      inviterName,
    })

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY")
      throw new Error("RESEND_API_KEY is not set")
    }

    console.log("Attempting to send email with Resend config:", {
      from: "team@habitkick.app",
      to: email,
      subject: `${inviterName} invited you to join HabitKick`,
    })

    const result = await resend.emails.send({
      from: "HabitKick <team@habitkick.app>",
      to: email,
      subject: `${inviterName} invited you to join HabitKick`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Join HabitKick</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #10B981; padding: 30px 40px; text-align: center;">
                        <h1 style="color: white; font-size: 28px; margin: 0;">You're Invited! 🎉</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #4B5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                          <strong>${inviterName}</strong> has invited you to join <strong>HabitKick</strong> - your ultimate tool to build and maintain healthy habits.
                        </p>
                        
                        <div style="text-align: center;">
                          <a href="${inviteUrl}" 
                             style="display: inline-block; background-color: #10B981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);">
                            Join HabitKick
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0;">
                          If you didn't expect this invitation, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    console.log("Resend API response:", result)

    if (result.error) {
      throw new Error(`Resend API error: ${result.error}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as Error
    console.error("Detailed error:", {
      error: err,
      message: err.message,
      stack: err.stack,
    })
    return NextResponse.json(
      {
        error: err.message || "Failed to send invitation",
        details: err,
      },
      {
        status: 500,
      }
    )
  }
}
