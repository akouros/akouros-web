import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

console.log('GITHUB_TOKEN set:', !!process.env.GITHUB_TOKEN)
console.log('Token prefix:', process.env.GITHUB_TOKEN?.slice(0, 8))

// scripts/index-kb.mjs
// Fetches .md files from akouros/structural-tools/knowledgebase/,
// embeds them with OpenAI text-embedding-3-small,
// and upserts into the Pinecone structural-kb index.

const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const OPENAI_API_KEY   = process.env.OPENAI_API_KEY
const GITHUB_TOKEN     = process.env.GITHUB_TOKEN // optional — required if repo is private

const GITHUB_REPO      = 'akouros/structural-tools'
const GITHUB_PATH      = 'knowledgebase/structural'
const PINECONE_INDEX   = 'structural-kb'
const EMBED_MODEL      = 'text-embedding-3-small'
const EMBED_DIM        = 1536

// ── helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function githubHeaders() {
  const headers = { 'Accept': 'application/vnd.github.v3+json' }
  if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  return headers
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: githubHeaders() })
  if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${url}`)
  return res.json()
}

async function fetchRaw(url) {
  const res = await fetch(url, { headers: githubHeaders() })
  if (!res.ok) throw new Error(`GitHub raw fetch error ${res.status} for ${url}`)
  return res.text()
}

async function embed(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI embed error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.data[0].embedding
}

async function getPineconeHost() {
  const res = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, {
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'X-Pinecone-API-Version': '2024-07',
    },
  })
  if (!res.ok) throw new Error(`Pinecone describe-index error ${res.status}`)
  const data = await res.json()
  return data.host  // e.g. "structural-kb-abc123.svc.pinecone.io"
}

async function upsert(host, vectors) {
  const res = await fetch(`https://${host}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': PINECONE_API_KEY,
    },
    body: JSON.stringify({ vectors }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Pinecone upsert error ${res.status}: ${err}`)
  }
  return res.json()
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is not set')
  if (!OPENAI_API_KEY)   throw new Error('OPENAI_API_KEY is not set')

  console.log(`Fetching file list from ${GITHUB_REPO}/${GITHUB_PATH} …`)
  const contentsUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`
  const entries = await fetchJSON(contentsUrl)
  const mdFiles = entries.filter(e => e.type === 'file' && e.name.endsWith('.md'))

  if (mdFiles.length === 0) {
    console.log('No .md files found. Exiting.')
    return
  }
  console.log(`Found ${mdFiles.length} .md file(s).\n`)

  console.log('Resolving Pinecone index host …')
  const host = await getPineconeHost()
  console.log(`Pinecone host: ${host}\n`)

  for (const file of mdFiles) {
    const filename = file.name
    const id = filename.replace(/\.md$/i, '')

    try {
      console.log(`[${filename}] Fetching content …`)
      const content = await fetchRaw(file.download_url)

      console.log(`[${filename}] Embedding (${content.length} chars) …`)
      const vector = await embed(content)

      console.log(`[${filename}] Upserting into Pinecone …`)
      await upsert(host, [
        {
          id,
          values: vector,
          metadata: {
            filename,
            source: 'structural-tools',
            content,
          },
        },
      ])

      console.log(`[${filename}] ✓ Done\n`)
    } catch (err) {
      console.error(`[${filename}] ✗ Error: ${err.message}\n`)
    }

    await sleep(2000)
  }

  console.log('All files processed.')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
