import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import './Agent.css'

const SYSTEM_PROMPT =
  'You are a structural engineering assistant with access to a curated knowledge base built by Alexi Kouromenos, a licensed SE/PE. Answer questions about structural engineering, seismic design, BIM, and related topics concisely and technically.'

const INIT_MESSAGE = {
  role: 'system',
  content:
    'Ask me anything about structural engineering — I\'m backed by a live knowledge base.',
}

export default function Agent() {
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

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
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
        {msg.content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  )
}
