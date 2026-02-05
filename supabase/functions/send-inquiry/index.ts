// Supabase Edge Function for sending property inquiry emails
// This uses Resend API to send professional emails in Bulgarian

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InquiryData {
  name: string
  email: string
  phone: string
  message: string
  propertyId?: string
  propertyTitle?: string
  location?: string
  broker?: string
  subject?: string
  type: 'property' | 'contact'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const inquiryData: InquiryData = await req.json()

    // Email to agency
    const agencyEmailHtml = inquiryData.type === 'property' 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📩 Ново запитване за имот</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
              <h2 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">🏠 Детайли за имота</h2>
              <p style="margin: 5px 0; color: #333;"><strong>ID:</strong> #${inquiryData.propertyId}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Име:</strong> ${inquiryData.propertyTitle}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Локация:</strong> ${inquiryData.location}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Отговорен брокер:</strong> ${inquiryData.broker}</p>
            </div>

            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
              <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">👤 Информация за клиента</h2>
              <p style="margin: 5px 0; color: #333;"><strong>Име:</strong> ${inquiryData.name}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Имейл:</strong> <a href="mailto:${inquiryData.email}" style="color: #3b82f6;">${inquiryData.email}</a></p>
              <p style="margin: 5px 0; color: #333;"><strong>Телефон:</strong> <a href="tel:${inquiryData.phone}" style="color: #3b82f6;">${inquiryData.phone}</a></p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">💬 Съобщение</h2>
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${inquiryData.message}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
              <p>Това запитване беше изпратено от уебсайта на Имоти Христов</p>
            </div>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📩 Ново запитване от контактна форма</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
              <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">👤 Информация за клиента</h2>
              <p style="margin: 5px 0; color: #333;"><strong>Име:</strong> ${inquiryData.name}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Имейл:</strong> <a href="mailto:${inquiryData.email}" style="color: #3b82f6;">${inquiryData.email}</a></p>
              <p style="margin: 5px 0; color: #333;"><strong>Телефон:</strong> <a href="tel:${inquiryData.phone}" style="color: #3b82f6;">${inquiryData.phone}</a></p>
              ${inquiryData.subject ? `<p style="margin: 5px 0; color: #333;"><strong>Относно:</strong> ${inquiryData.subject}</p>` : ''}
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">💬 Съобщение</h2>
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${inquiryData.message}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
              <p>Това запитване беше изпратено от уебсайта на Имоти Христов</p>
            </div>
          </div>
        </div>
      `

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Благодарим Ви!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Здравейте, <strong>${inquiryData.name}</strong>,</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Получихме Вашето запитване успешно! Нашият екип ще се свърже с Вас възможно най-скоро.
          </p>

          ${inquiryData.type === 'property' ? `
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <p style="margin: 5px 0; color: #333;"><strong>Имот:</strong> ${inquiryData.propertyTitle}</p>
              <p style="margin: 5px 0; color: #333;"><strong>ID:</strong> #${inquiryData.propertyId}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Локация:</strong> ${inquiryData.location}</p>
            </div>
          ` : ''}

          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">📞 Свържете се с нас</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Телефон:</strong> <a href="tel:+359888123456" style="color: #3b82f6;">+359 888 123 456</a></p>
            <p style="margin: 5px 0; color: #333;"><strong>Имейл:</strong> <a href="mailto:imotihristov@gmail.com" style="color: #3b82f6;">imotihristov@gmail.com</a></p>
          </div>

          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 20px;">
            С уважение,<br>
            <strong style="color: #22c55e;">Екипът на Имоти Христов</strong>
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Това е автоматично генериран имейл. Моля, не отговаряйте директно на него.</p>
          </div>
        </div>
      </div>
    `

    // Send email to agency
    console.log('Sending inquiry to imotihristov@gmail.com, type:', inquiryData.type)
    const agencyResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Имоти Христов <onboarding@resend.dev>',
        to: ['imotihristov@gmail.com'],
        subject: inquiryData.type === 'property' 
          ? `Запитване за имот #${inquiryData.propertyId} - ${inquiryData.propertyTitle}`
          : 'Ново запитване от контактна форма',
        html: agencyEmailHtml,
      }),
    })

    if (!agencyResponse.ok) {
      const errorText = await agencyResponse.text()
      console.error('Failed to send agency email:', errorText)
      throw new Error(`Failed to send agency email: ${errorText}`)
    }
    
    console.log('Agency email sent successfully')

    // Send confirmation email to customer
    console.log('Sending customer confirmation to:', inquiryData.email)
    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Имоти Христов <onboarding@resend.dev>',
        to: [inquiryData.email],
        subject: 'Потвърждение за получено запитване - Имоти Христов',
        html: customerEmailHtml,
      }),
    })

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text()
      console.error('Failed to send customer confirmation email:', errorText)
      console.error('Customer email response status:', customerResponse.status)
      // Don't throw error - agency email is more important, but log the issue
    } else {
      console.log('Customer confirmation email sent successfully to:', inquiryData.email)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
