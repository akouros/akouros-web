import { NavLink } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__logo">AK</NavLink>
        <ul className="nav__links">
          <li>
            <NavLink
              to="/portfolio"
              className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
            >
              Portfolio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resume"
              className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
            >
              Resume
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/agent"
              className={({ isActive }) => `nav__link nav__link--button${isActive ? ' active' : ''}`}
            >
              Agent
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
