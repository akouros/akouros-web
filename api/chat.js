export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  const { messages } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: "You are a structural engineering KB retrieval assistant. Your only job is to find and return relevant content from the provided knowledge base entries.\n\nRules:\n- Only use information explicitly present in the KB entries provided in the context\n- Do not add information from your training data\n- Do not paraphrase or reword technical content, notes, or specifications — return them verbatim\n- If the answer is not in the provided KB entries, say exactly: 'This topic is not in the current KB. Try rephrasing or check the source files directly.'\n- No filler, no introductions, no closing remarks\n- Format lists as bullet points exactly as they appear in the source",
      messages
    })
  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
