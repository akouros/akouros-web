import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
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
    images: ['/images/Easemble.png'],
  },
  {
    index: '02',
    title: 'Aquabred — NuWave USA',
    type: 'Concept Design',
    year: '2017–2021',
    description:
      'An exercise facility benefiting both human health and the surrounding ecosystem, featuring custom aquatic exercise equipment. The Aqua-barge fitness center improves water conditions in contaminated bodies of water — rotational motion from Aqua-bikes and Aqua-treadmills powers water aeration pumps to improve water quality and promote ecosystem growth.',
    tags: ['Concept', 'Aquatic', 'Sustainable', 'Steel'],
    images: [
      '/images/Aquabred-barge.png',
      '/images/Aquabred-cycle.png',
      '/images/Aquabred-treadmill.png',
    ],
  },
  {
    index: '03',
    title: 'Custom Residential Truss — Ware Associates',
    type: 'Structural Engineering',
    year: '2017',
    description:
      'Open plan living room truss spanning 20 feet, transitioning into a steel cantilevered eave at the building envelope. Collaboration with Cheng Design. Glulam top chord shaped for aesthetic purposes with a custom king post connection clamping a tension cable.',
    tags: ['Glulam', 'Steel', 'Residential', 'Truss'],
    images: ['/images/Truss.png'],
  },
  {
    index: '04',
    title: 'Shadow Cliffs Park Entrance — Ware Associates',
    type: 'Structural Engineering',
    year: '2018',
    description:
      'A collaboration between architecture and engineering for the Shadow Cliffs Park entrance. Triangular roof in plan made of cross-laminated timber supported by timber beams and steel columns. Approved by the East Bay Regional Park organization — now a welcoming point to all visitors.',
    tags: ['CLT', 'Timber', 'Steel', 'Park Structure'],
    images: ['/images/shadow-cliffs.jpg'],
  },
  {
    index: '05',
    title: 'Redwood Visitor Center — Mar Structural Design',
    type: 'Structural Engineering',
    year: '2020',
    description:
      'A gateway to the vast California redwood forest. Two buildings with traditional pitched roofs and sloped ridges, visually connected by a translucent clad space truss canopy seismically isolated at one end. Plywood shear walls and bent steel moment frames resist wind and seismic forces.',
    tags: ['Timber', 'Steel', 'Seismic', 'Space Truss'],
    images: ['/images/Redwood-Visitor-Center-01.jpg'],
  },
]

function Lightbox({ project, onClose }) {
  const [imgIndex, setImgIndex] = useState(0)
  const hasMultiple = project.images.length > 1

  const prev = useCallback(() =>
    setImgIndex(i => (i - 1 + project.images.length) % project.images.length),
    [project.images.length]
  )
  const next = useCallback(() =>
    setImgIndex(i => (i + 1) % project.images.length),
    [project.images.length]
  )

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (hasMultiple && e.key === 'ArrowLeft') prev()
      if (hasMultiple && e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, hasMultiple, prev, next])

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>

      <div className="lightbox__frame" onClick={e => e.stopPropagation()}>
        <img
          key={imgIndex}
          src={project.images[imgIndex]}
          alt={project.title}
          className="lightbox__img"
        />

        {hasMultiple && (
          <>
            <button className="lightbox__arrow lightbox__arrow--prev" onClick={prev} aria-label="Previous">
              <ChevronLeft size={28} />
            </button>
            <button className="lightbox__arrow lightbox__arrow--next" onClick={next} aria-label="Next">
              <ChevronRight size={28} />
            </button>
            <div className="lightbox__dots">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  className={`lightbox__dot${i === imgIndex ? ' active' : ''}`}
                  onClick={() => setImgIndex(i)}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [lightbox, setLightbox] = useState(null) // project object or null

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

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

              <button
                className="project-row__thumbnail"
                onClick={() => setLightbox(p)}
                aria-label={`View images for ${p.title}`}
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="project-row__thumb-img"
                />
              </button>
            </article>
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox project={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
