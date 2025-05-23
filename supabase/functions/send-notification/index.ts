
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  email: string;
  title: string;
  message: string;
  type: 'collection_reminder' | 'payment_success' | 'item_registered' | 'general';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, email, title, message, type }: NotificationRequest = await req.json();

    console.log('Notification request:', { userId, email, title, type });

    // Store notification in database
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type: 'email'
    });

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "E-Cycle <noreply@resend.dev>",
      to: [email],
      subject: `E-Cycle: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">♻️ E-Cycle</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <h2 style="color: #374151;">${title}</h2>
            <p style="color: #6b7280; line-height: 1.6;">${message}</p>
            ${type === 'collection_reminder' ? `
              <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #065f46; margin: 0;">Don't forget to prepare your e-waste items for collection!</p>
              </div>
            ` : ''}
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://your-app-url.com" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Visit E-Cycle</a>
            </div>
          </div>
          <div style="background: #374151; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
            <p>© 2024 E-Cycle. Making the world greener, one device at a time.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
