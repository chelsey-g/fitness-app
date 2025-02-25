import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  console.log('API route hit: /api/send-invitation')
  
  try {
    const { email, competitionName, competitionId } = await request.json()
    
    // Make sure competitionId is a number
    const numericCompetitionId = parseInt(competitionId)
    
    console.log('Request data:', { 
      email, 
      competitionName, 
      competitionId: numericCompetitionId 
    })

    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY')
      throw new Error('RESEND_API_KEY is not set')
    }

    console.log('Attempting to send email with Resend config:', {
      from: 'team@habitkick.app',
      to: email,
      subject: `Join ${competitionName} on HabitKick`
    })

    console.log('Generating invitation link with:', {
      email,
      competitionName,
      competitionId: numericCompetitionId,
      rawCompetitionId: competitionId
    })

    console.log('Received invitation request:', {
      email,
      competitionName,
      competitionId: typeof numericCompetitionId,
      rawCompetitionId: competitionId
    })

    const invitationLink = `http://localhost:3000/invitation?email=${encodeURIComponent(email)}&competition=${encodeURIComponent(competitionName)}&competitionId=${numericCompetitionId}&redirectTo=${encodeURIComponent(`/competitions/${numericCompetitionId}`)}`

    console.log('Generated link:', invitationLink)

    const result = await resend.emails.send({
      from: 'HabitKick <team@habitkick.app>',
      to: email,
      subject: `Join ${competitionName} on HabitKick`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Join HabitKick Competition</title>
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
                        <p style="color: #4B5563; font-size: 16px; line-height: 24px; margin-bottom: 24px; text-align: center;">
                          You've been invited to join a competition on <strong>HabitKick!</strong>
                           <strong style="color: #10B981;">${competitionName}</strong>
                        </p>
                        
                        <div style="text-align: center;">
                          <a href="${invitationLink}" 
                             style="display: inline-block; background-color: #10B981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);">
                            Join Competition
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
                  
                  <!-- Copyright -->
                  <p style="color: #6B7280; font-size: 12px; margin-top: 24px; text-align: center;">
                    © ${new Date().getFullYear()} HabitKick. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    })

    console.log('Resend API response:', result)

    if (result.error) {
      throw new Error(`Resend API error: ${result.error}`)
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    const err = error as Error
    console.error('Detailed error:', {
      error: err,
      message: err.message,
      stack: err.stack
    })
    return NextResponse.json({ 
      error: err.message || 'Failed to send email',
      details: err
    }, { 
      status: 500 
    })
  }
} 