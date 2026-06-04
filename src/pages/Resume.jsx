import { Download } from 'lucide-react'
import './Resume.css'

const experience = [
  {
    company: 'H2M Architects + Engineers',
    location: 'NYC',
    role: 'Senior Structural Engineer',
    dates: 'April 2024 – Present',
    bullets: [
      'Lead multiple major projects including school additions and wastewater facilities, overseeing staff and coordinating with multidisciplinary teams.',
      'Structural analysis and design for diverse building systems, specializing in steel and concrete for mid to high-rise structures.',
      'Manage restorations and new constructions, ensuring seamless integration with architectural and MEP designs.',
      'Conduct site inspections, review shop drawings, and handle RFIs across project phases.',
      "Spearheaded development of the team's Revit infrastructure: standardizing libraries, optimizing templates, and creating custom plugins.",
      'Mentor junior engineers and collaborate with PMs to monitor budgets and track change orders.',
    ],
  },
  {
    company: 'Mar Structural Design',
    location: 'Berkeley, CA',
    role: 'Project Engineer',
    dates: 'November 2018 – April 2024',
    bullets: [
      'Calculations and construction documents across project types: city-owned summer camp, 142,500 sf K–8 school, prefabricated modular schools, affordable housing, Berkeley High School renovation, 1920s theater renovation — steel, concrete, timber, masonry.',
      'Managed multi-million dollar projects on time and on budget; created proposals, budgets, and work plans.',
      'Administered construction phases including shop drawing review and international correspondence with fabricators.',
      'Conducted complex nonlinear FEA seismic risk assessments.',
      'Developed office calculation and Revit tools; led onboarding and training.',
    ],
  },
  {
    company: 'Ware Associates A+E',
    location: 'Oakland, CA',
    role: 'Structural Designer',
    dates: 'Summer 2015 & January 2016 – October 2018',
    bullets: [
      'Calculations and construction documents for high-end residential and community structures across steel, concrete, wood, and masonry.',
      'Led concept design for a custom truss, pedestrian bridge, and residential rooftop addition including FEA feasibility study.',
      'Administered construction phases; trained interns; developed in-house design tools.',
    ],
  },
]

const education = [
  {
    school: 'California Polytechnic State University, San Luis Obispo',
    detail: 'Bachelor of Science and Master of Architectural Engineering · August 2011 – December 2016',
  },
]

const licenses = [
  { name: 'P.E. Civil — New York', detail: 'License No. 110141-01' },
  { name: 'P.E. Civil — Massachusetts', detail: 'License No. 58732' },
]

const skills = [
  {
    cluster: 'Structural',
    tags: ['ETABS', 'Perform3D', 'RISA', 'Karamba3D'],
  },
  {
    cluster: 'BIM',
    tags: ['Revit', 'Dynamo', 'AutoCAD', 'Rhino', 'Grasshopper'],
  },
  {
    cluster: 'Development',
    tags: ['C#', 'Visual Studio', 'Matlab'],
  },
  {
    cluster: 'Visualization',
    tags: ['Twinmotion', 'Adobe Suite', 'Bluebeam'],
  },
]

const publications = [
  {
    title: '"Lateral Strength and Ductile Behavior of a Mortise-Tenon Connected Timber Frame"',
    detail: 'World Conference on Timber Engineering 2018, Seoul S.K.',
  },
]

export default function Resume() {
  return (
    <>
      <div className="container">
        <div className="resume__header">
          <div>
            <p className="resume__eyebrow">Curriculum Vitae</p>
            <h1 className="resume__title">Resume</h1>
          </div>
          <a href="/resume.pdf" download className="resume__download">
            <Download size={14} /> Download PDF
          </a>
        </div>
      </div>

      <div className="resume__body">
        <div className="container">

          {/* Experience */}
          <section className="resume__section">
            <div className="resume__section-grid">
              <span className="resume__section-label">Experience</span>
              <div>
                {experience.map((job) => (
                  <div key={job.company} className="experience-item">
                    <div className="experience-item__header">
                      <span className="experience-item__company">
                        {job.company}
                        <span style={{ fontWeight: 400, color: 'var(--color-subtle)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                          — {job.location}
                        </span>
                      </span>
                      <span className="experience-item__dates">{job.dates}</span>
                    </div>
                    <p className="experience-item__role">{job.role}</p>
                    <ul className="experience-item__bullets">
                      {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="resume__section">
            <div className="resume__section-grid">
              <span className="resume__section-label">Education</span>
              <div>
                {education.map((e) => (
                  <div key={e.school} className="edu-item">
                    <p className="edu-item__school">{e.school}</p>
                    <p className="edu-item__detail">{e.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Licenses */}
          <section className="resume__section">
            <div className="resume__section-grid">
              <span className="resume__section-label">Licenses</span>
              <div className="license-list">
                {licenses.map((l) => (
                  <div key={l.name} className="license-item">
                    <span className="license-item__name">{l.name}</span>
                    <span className="license-item__detail">{l.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="resume__section">
            <div className="resume__section-grid">
              <span className="resume__section-label">Skills</span>
              <div className="skills-grid">
                {skills.map((s) => (
                  <div key={s.cluster} className="skill-cluster">
                    <p className="skill-cluster__name">{s.cluster}</p>
                    <div className="skill-cluster__tags">
                      {s.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Publications */}
          <section className="resume__section">
            <div className="resume__section-grid">
              <span className="resume__section-label">Publications</span>
              <div>
                {publications.map((p, i) => (
                  <div key={i} className="publication-item">
                    <p className="publication-item__title">{p.title}</p>
                    <p className="publication-item__detail">{p.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
