import './Portfolio.css'

const projects = [
  {
    index: '01',
    title: 'Easemble',
    type: 'Thesis Project',
    year: '2017–2021',
    description:
      'A collection of dowels and frame modules for constructing resilient low-rise residential and small commercial buildings. Composed of prefabricated open, window, door, exterior, and interior wall frame modules. Floor and roof loads supported by cross-laminated timber. U-shape configuration with communal outdoor spaces creates places for human connection.',
    tags: ['CLT', 'Prefabricated', 'Residential', 'Thesis'],
  },
  {
    index: '02',
    title: 'Aquabred — NuWave USA',
    type: 'Concept Design',
    year: '2017–2021',
    description:
      'An exercise facility benefiting both human health and the surrounding ecosystem, featuring custom aquatic exercise equipment. The Aqua-barge fitness center improves water conditions in contaminated bodies of water — rotational motion from Aqua-bikes and Aqua-treadmills powers water aeration pumps to improve water quality and promote ecosystem growth.',
    tags: ['Concept', 'Aquatic', 'Sustainable', 'Steel'],
  },
  {
    index: '03',
    title: 'Custom Residential Truss — Ware Associates',
    type: 'Structural Engineering',
    year: '2017',
    description:
      'Open plan living room truss spanning 20 feet, transitioning into a steel cantilevered eave at the building envelope. Collaboration with Cheng Design. Glulam top chord shaped for aesthetic purposes with a custom king post connection clamping a tension cable.',
    tags: ['Glulam', 'Steel', 'Residential', 'Truss'],
  },
  {
    index: '04',
    title: 'Shadow Cliffs Park Entrance — Ware Associates',
    type: 'Structural Engineering',
    year: '2018',
    description:
      'A collaboration between architecture and engineering for the Shadow Cliffs Park entrance. Triangular roof in plan made of cross-laminated timber supported by timber beams and steel columns. Approved by the East Bay Regional Park organization — now a welcoming point to all visitors.',
    tags: ['CLT', 'Timber', 'Steel', 'Park Structure'],
  },
  {
    index: '05',
    title: 'Redwood Visitor Center — Mar Structural Design',
    type: 'Structural Engineering',
    year: '2020',
    description:
      'A gateway to the vast California redwood forest. Two buildings with traditional pitched roofs and sloped ridges, visually connected by a translucent clad space truss canopy seismically isolated at one end. Plywood shear walls and bent steel moment frames resist wind and seismic forces.',
    tags: ['Timber', 'Steel', 'Seismic', 'Space Truss'],
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
            <article key={p.index} className="project-row">
              <span className="project-row__index">{p.index}</span>

              <div className="project-row__content">
                <p className="project-row__meta">{p.type} · {p.year}</p>
                <h2 className="project-row__title">{p.title}</h2>
                <p className="project-row__desc">{p.description}</p>
                <div className="project-row__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="project-row__thumbnail" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
