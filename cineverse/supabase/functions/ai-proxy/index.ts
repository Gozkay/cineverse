import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-3.5-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const STORE_SYSTEM_PROMPT = `You are CineVerse Assistant, the friendly AI helper for CineVerse — an online entertainment marketplace selling movies, books, manga, and comics.

Facts about the store:
- Categories: Movies, Books, Manga, Comics (all priced in Nigerian Naira, NGN).
- Prices are generated dynamically, so give general guidance, not exact prices.
- Customers can browse categories, search, add to cart, checkout with Paystack, use coupons, request refunds, and track orders in their profile.
- Users can also become sellers.
- Keep answers concise (under 120 words), friendly, and helpful.
- If asked about a specific product you don't have data for, suggest browsing the relevant category.
- Use markdown formatting sparingly (bold for emphasis only).`

const RECOMMEND_PROMPT = `You are a recommendation engine for CineVerse, an entertainment marketplace (movies, books, manga, comics).

Given the user's interests (items in their cart/wishlist), recommend 5 products they'd likely enjoy. Return ONLY valid JSON in this exact shape:
{"recommendations":[{"title":"Product title","category":"movie|book|manga|comic","reason":"one short sentence why"}]}`

const SEARCH_PROMPT = `You are a search interpreter for CineVerse (movies, books, manga, comics marketplace).
Interpret the user's natural language query and return ONLY valid JSON in this exact shape:
{"category":"movie|book|manga|comic|null","keywords":["keyword1","keyword2"],"explanation":"short phrase for the user"}`

const GENERATE_PROMPT = `You are a product copywriter for CineVerse, an entertainment marketplace.
Write a compelling product description in 3-4 sentences. Keep it energetic and appealing. Return ONLY plain text, no JSON, no markdown headers.`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { action = 'chat', messages = [], query, interests, item, product } = body

  let systemInstruction = STORE_SYSTEM_PROMPT
  let contents = []

  switch (action) {
    case 'chat': {
      contents = Array.isArray(messages) ? messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || m.text || '' }],
      })) : []
      if (!contents.length) contents = [{ role: 'user', parts: [{ text: 'Hi' }] }]
      break
    }
    case 'recommend': {
      systemInstruction = RECOMMEND_PROMPT
      const list = Array.isArray(interests) ? interests.map((i) => {
        const label = typeof i === 'string' ? i : `${i.title}${i.category ? ` (${i.category})` : ''}`
        return `- ${label}`
      }).join('\n') : ''
      contents = [{ role: 'user', parts: [{ text: `My interests:\n${list || 'none yet'}` }] }]
      break
    }
    case 'summarize': {
      const itemText = item && typeof item === 'object'
        ? Object.entries(item).filter(([, v]) => typeof v === 'string' || typeof v === 'number').map(([k, v]) => `${k}: ${v}`).join('\n')
        : String(item || '')
      systemInstruction = `You are a storyteller for CineVerse. Write a captivating 3-4 sentence summary of the following ${item?.category || 'product'} that makes someone want to buy it. Return ONLY plain text.`
      contents = [{ role: 'user', parts: [{ text: `Product details:\n${itemText}` }] }]
      break
    }
    case 'search': {
      systemInstruction = SEARCH_PROMPT
      contents = [{ role: 'user', parts: [{ text: `Query: ${query || ''}` }] }]
      break
    }
    case 'generate': {
      systemInstruction = GENERATE_PROMPT
      const productText = product && typeof product === 'object'
        ? Object.entries(product).filter(([, v]) => typeof v === 'string' || typeof v === 'number').map(([k, v]) => `${k}: ${v}`).join('\n')
        : String(product || '')
      contents = [{ role: 'user', parts: [{ text: `Write a description for:\n${productText}` }] }]
      break
    }
    default:
      return new Response(JSON.stringify({ error: 'Unknown action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
  }

  const needsJson = action === 'recommend' || action === 'search'

  const payload = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      ...(needsJson ? { responseMimeType: 'application/json' } : {}),
    },
  }

  try {
    const doFetch = () => fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    let res = await doFetch()

    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000))
      res = await doFetch()
    }

    if (!res.ok) {
      const errText = await res.text()
      const isBusy = res.status === 429
      const retryAfter = res.headers.get('retry-after')
      return new Response(
        JSON.stringify({ error: isBusy ? 'ai_busy' : `Gemini API error: ${res.status} ${errText.slice(0, 500)}` }),
        {
          status: isBusy ? 503 : 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            ...(retryAfter ? { 'Retry-After': retryAfter } : {}),
          },
        },
      )
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (needsJson) {
      try {
        const parsed = JSON.parse(text)
        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } catch {
        return new Response(JSON.stringify({ raw: text }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: `AI request failed: ${err.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
