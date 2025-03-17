import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  try {
    const { email, full_name, message_count } = await req.json()

    // Send email notification using Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'You have unread messages',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${full_name || 'there'}!</h2>
          <p>You have ${message_count} unread message${message_count > 1 ? 's' : ''}.</p>
          <p>Please log in to your account to view them.</p>
          <a href="${Deno.env.get('NEXT_PUBLIC_APP_URL')}/messages" 
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            View Messages
          </a>
        </div>
      `
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}) 