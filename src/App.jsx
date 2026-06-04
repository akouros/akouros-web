import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import Agent from './pages/Agent'
import './App.css'

const STORAGE_KEY = 'ak_auth'
const PASSWORD_HASH = 'fe88609f5fd7bd82a0787581b3dfc61a420283ae9b97adc755bd2a91f4504341'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
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
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '320px', padding: '0 1.5rem' }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>
          AK
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

function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  return (
    <BrowserRouter>
      <Nav />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/agent" element={<Agent />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
