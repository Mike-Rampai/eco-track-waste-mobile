import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyzeRequest {
  description: string;
  wasteType: string;
  location: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, wasteType, location }: AnalyzeRequest = await req.json();

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `You are an environmental expert analyzing illegal e-waste dumping sites. 
    
Site Information:
- Location: ${location}
- Waste Type: ${wasteType}
- Description: ${description}

Please analyze this dumping site and provide:
1. A severity level (low, medium, high, or critical)
2. Detailed recommendations for handling and cleanup

Return your response in this exact JSON format:
{
  "severity": "low|medium|high|critical",
  "recommendations": "detailed recommendations text"
}`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an environmental expert specializing in e-waste management and hazardous material assessment. Always respond in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      // Fallback response
      analysis = {
        severity: 'medium',
        recommendations: content
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-dumping-report:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        severity: 'medium',
        recommendations: 'Unable to perform AI analysis. Please ensure all fields are filled correctly and try again.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});