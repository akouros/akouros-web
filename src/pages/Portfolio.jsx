import './Portfolio.css'

const projects = [
  {
    index: '01',
    type: 'BIM Automation',
    year: '2024',
    title: 'Revit Structural Grid Automation',
    description:
      'A Dynamo + Python toolset that generates column grids, beam framing, and slab openings from a single CSV input. Reduced typical framing layout time from ~4 hours to under 20 minutes across a 40-story residential tower.',
    tags: ['Dynamo', 'Python', 'Revit API', 'Structural'],
  },
  {
    index: '02',
    type: 'Engineering AI',
    year: '2025',
    title: 'Structural Knowledge Base Agent',
    description:
      'RAG pipeline built on a curated library of AISC, ACI, and ASCE documents. Engineers query it in plain language and receive citation-backed answers — live at akouros.com/agent.',
    tags: ['RAG', 'LLM', 'Python', 'Vector DB'],
  },
  {
    index: '03',
    type: 'Structural Engineering',
    year: '2023',
    title: 'Adaptive Reuse — Concrete Shear Wall Assessment',
    description:
      'Seismic assessment and retrofit design for a 1960s concrete frame building converted to residential use. Developed a custom OpenSees model to evaluate demand-capacity ratios under MCE ground motions.',
    tags: ['Seismic', 'Concrete', 'OpenSees', 'ASCE 41'],
  },
]

export default function Portfolio() {
  return (
    <>
      <div className="portfolio__header">
        <div className="container">
          <p className="portfolio__eyebrow">Selected Work</p>
          <h1 className="portfolio__title">Portfolio</h1>
        </div>
      </div>

      <div className="portfolio__list">
        <div className="container">
          {projects.map((p) => (
            <div key={p.index} className="project-row">
              <span className="project-row__index">{p.index}</span>
              <div className="project-row__content">
                <p className="project-row__meta">{p.type} — {p.year}</p>
                <h2 className="project-row__title">{p.title}</h2>
                <p className="project-row__desc">{p.description}</p>
                <div className="project-row__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-row__thumbnail">Thumbnail</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
