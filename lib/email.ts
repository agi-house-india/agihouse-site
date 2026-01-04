import { Resend } from 'resend'

// Use testing domain for now, switch to agihouse.in later
const FROM_EMAIL = process.env.EMAIL_FROM || 'AGI House India <onboarding@resend.dev>'

// Lazily create Resend client only when needed
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

interface ApprovalEmailParams {
  to: string
  name: string
  profileUrl: string
}

export async function sendApprovalEmail({ to, name, profileUrl }: ApprovalEmailParams) {
  const resend = getResendClient()
  if (!resend) {
    console.log('RESEND_API_KEY not set, skipping email')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to AGI House India!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f0f0f; color: #ffffff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #333;">
    <h1 style="color: #a855f7; margin: 0 0 24px; font-size: 28px;">Welcome to AGI House India!</h1>

    <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
      Hi ${name || 'there'},
    </p>

    <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
      Great news! Your profile has been approved. You're now part of India's premier AI community with 20,000+ members.
    </p>

    <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
      Your profile is now visible in our member directory. Connect with AI founders, investors, and builders across India.
    </p>

    <a href="${profileUrl}" style="display: inline-block; background-color: #a855f7; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 24px;">
      View Your Profile
    </a>

    <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #333;">
      See you at the next event!<br>
      <strong style="color: #e5e5e5;">AGI House India</strong>
    </p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Failed to send approval email:', error)
      return { success: false, error: error.message }
    }

    console.log('Approval email sent:', data?.id)
    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: 'Failed to send email' }
  }
}
