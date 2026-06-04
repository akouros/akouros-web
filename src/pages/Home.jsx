import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './Home.css'

export default function Home() {
  return (
    <section className="home__hero">
      <div className="container">
        <p className="home__eyebrow">Structural Engineer — BIM Automation — New York</p>
        <h1 className="home__name">
          Alexi<br />
          <span className="home__name-last">Kouromenos</span>
        </h1>
        <p className="home__bio">
          I design structures and build the software that makes designing them faster.
          Licensed PE, currently focused on the intersection of structural analysis,
          BIM automation, and applied AI for engineering workflows.
        </p>
        <div className="home__cta">
          <Link to="/agent" className="btn btn--primary">
            Try the Agent <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
