// Supabase Edge Function: generate-listing
//
// Deploy with:
//   supabase functions deploy generate-listing
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Takes a seller's rough, typo-filled notes ("selling my samsung a14 barely
// used 128gb no cracks asking 1500 or best offer") and returns a clean
// title/description/category the SellModal can drop straight into the form
// for the seller to review and edit before posting.
//
// Keeping this server-side (instead of calling api.anthropic.com from the
// browser) means the API key is never exposed to anyone viewing page source.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const CATEGORIES = [
  'Electronics', 'Fashion', 'Food', 'Services',
  'Jobs', 'Property', 'Vehicles', 'Beauty',
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { notes } = await req.json()

    if (!notes || typeof notes !== 'string' || notes.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Please describe the item first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = `You write clean, honest marketplace listings for Hustle Hard, a \
local buy/sell app in KwaMhlanga, Mpumalanga. Given a seller's rough notes, \
respond with ONLY a JSON object (no markdown fences, no preamble) shaped like:
{"title": "short punchy title, max 60 chars", "description": "2-3 sentence description in the seller's voice, honest about condition, no invented details", "category": "one of: ${CATEGORIES.join(', ')}"}
Never invent facts (condition, extras, reason for selling) that aren't implied by the notes. \
Keep it truthful and specific rather than salesy.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: notes }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text ?? '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    if (!CATEGORIES.includes(parsed.category)) {
      parsed.category = CATEGORIES[0]
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Could not draft a listing right now.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
