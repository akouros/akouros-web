import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import Agent from './pages/Agent'
import './App.css'

function App() {
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
