import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import './Agent.css'

const STORAGE_KEY = 'ak_auth'
const PASSWORD_HASH = 'fe88609f5fd7bd82a0787581b3dfc61a420283ae9b97adc755bd2a91f4504341'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const INIT_MESSAGE = {
  role: 'system',
  content: "Ask me anything about structural engineering — I'm backed by a live knowledge base.",
}

function PasswordGate({ onAuth }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const hash = await sha256(value)
    if (hash === PASSWORD_HASH) {
      localStorage.setItem(STORAGE_KEY, '1')
      onAuth()
    } else {
      setError(true)
      setValue('')
    }
  }

  function handleChange(e) {
    setValue(e.target.value)
    if (error) setError(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#fff', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      zIndex: 200,
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '320px', padding: '0 1.5rem' }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>
          KB Agent
        </p>
        <input
          type="password"
          autoFocus
          placeholder="Password"
          value={value}
          onChange={handleChange}
          style={{
            width: '100%', padding: '0.65rem 0.875rem',
            fontSize: '0.9375rem', fontFamily: 'inherit',
            background: '#f5f5f7', border: error ? '1px solid #ff3b30' : '1px solid transparent',
            borderRadius: '10px', outline: 'none', color: '#1d1d1f',
            transition: 'border-color 0.15s',
          }}
        />
        {error && (
          <p style={{ fontSize: '0.8125rem', color: '#ff3b30', margin: '-0.25rem 0 0', alignSelf: 'flex-start' }}>
            Incorrect password
          </p>
        )}
        <button
          type="submit"
          style={{
            width: '100%', padding: '0.65rem', fontSize: '0.9375rem',
            fontFamily: 'inherit', fontWeight: 500, background: '#1d1d1f',
            color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Continue
        </button>
      </form>
    </div>
  )
}

export default function Agent() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')
  const [messages, setMessages] = useState([INIT_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const apiMessages = next
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const assistantText = data.content?.[0]?.text ?? '(no response)'
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}` },
      ])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  return (
    <div className="agent">
      <div className="agent__header">
        <h1 className="agent__title">KB Agent</h1>
        <span className="agent__subtitle">Structural Engineering Assistant</span>
      </div>

      <div className="agent__messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="message message--assistant">
            <div className="message__avatar">AK</div>
            <div className="message__bubble">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="agent__input-bar">
        <div className="agent__input-inner">
          <textarea
            ref={textareaRef}
            className="agent__input"
            placeholder="Ask about structural engineering, seismic design, BIM…"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="agent__send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }) {
  const avatarLabel =
    msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'AK' : '★'

  return (
    <div className={`message message--${msg.role}`}>
      <div className="message__avatar">{avatarLabel}</div>
      <div className="message__bubble">
        {msg.role === 'assistant' ? (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {msg.content}
          </ReactMarkdown>
        ) : (
          msg.content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))
        )}
      </div>
    </div>
  )
}
