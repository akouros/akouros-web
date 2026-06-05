export const config = { runtime: 'edge' }

const PINECONE_HOST = 'structural-kb-su0omeo.svc.aped-4627-b74a.pinecone.io'

const SYSTEM_RULES = `You are a structural engineering KB retrieval assistant. Your only job is to find and return relevant content from the provided knowledge base entries.

Rules:
- Only use information explicitly present in the KB entries provided in the context
- Do not add information from your training data
- Do not paraphrase or reword technical content, notes, or specifications — return them verbatim
- If the answer is not in the provided KB entries, say exactly: 'This topic is not in the current KB. Try rephrasing or check the source files directly.'
- No filler, no introductions, no closing remarks
- Format lists as bullet points exactly as they appear in the source`

async function embedQuery(query) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: query }),
  })
  if (!res.ok) throw new Error(`OpenAI embed error ${res.status}`)
  const data = await res.json()
  return data.data[0].embedding
}

async function queryPinecone(vector) {
  const res = await fetch(`https://${PINECONE_HOST}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.PINECONE_API_KEY,
    },
    body: JSON.stringify({
      vector,
      topK: 5,
      includeMetadata: true,
    }),
  })
  if (!res.ok) throw new Error(`Pinecone query error ${res.status}`)
  const data = await res.json()
  return data.matches ?? []
}

function buildContext(matches) {
  const entries = matches
    .map(m => m.metadata?.content)
    .filter(Boolean)
  if (entries.length === 0) return ''
  return 'Relevant KB entries:\n\n---\n\n' + entries.join('\n\n---\n\n')
}

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

  // 1. Extract the last user message as the query
  const lastUser = [...messages].reverse().find(m => m.role === 'user')
  const query = lastUser?.content ?? ''

  // 2 & 3. Embed the query and retrieve top-5 KB matches from Pinecone
  const vector = await embedQuery(query)
  const matches = await queryPinecone(vector)

  // 4 & 5. Build context string from matched metadata
  const context = buildContext(matches)

  // 6. Prepend KB context to the system prompt
  const system = context
    ? `${context}\n\n---\n\n${SYSTEM_RULES}`
    : SYSTEM_RULES

  // 7. Call Claude with the enriched system prompt
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
      system,
      messages,
    }),
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
