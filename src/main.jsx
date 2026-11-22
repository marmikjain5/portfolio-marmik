import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Code2, Eye, ExternalLink, Heart, Mail, Moon, Sparkles, Sun, X } from 'lucide-react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import './styles.css'

const sections = [
  { id: 'education', label: 'Education', eyebrow: '01', color: '#e6a34d', outfit: 'academic', detail: 'The foundations, curiosities, and ideas that shaped how I think.' },
  { id: 'experience', label: 'Experience', eyebrow: '02', color: '#d86b58', outfit: 'formal', detail: 'A timeline of the places, people, and problems I have worked with.' },
  { id: 'skills', label: 'Skills', eyebrow: '03', color: '#79ad89', outfit: 'technical', detail: 'The tools and habits I use to turn loose ideas into useful things.' },
  { id: 'projects', label: 'Projects', eyebrow: '04', color: '#b77bd1', outfit: 'creator', detail: 'Selected work, experiments, and things I am proud to have made.' },
  { id: 'achievements', label: 'Achievements', eyebrow: '05', color: '#d7bd55', outfit: 'award', detail: 'Milestones that made the long nights worth it.' },
  { id: 'about', label: 'About me', eyebrow: '06', color: '#6aa7c9', outfit: 'casual', detail: 'A little more about the person behind the screen.' },
]

const projects = [
  { title: 'Project Atlas', type: 'Product', year: '2025', color: '#b77bd1', text: 'A focused workspace for turning scattered ideas into clear, shippable plans.', tags: ['React', 'Product design', 'Prototyping'] },
  { title: 'Second Nature', type: 'Personal', year: '2024', color: '#d86b58', text: 'A warm digital identity for a team building more thoughtful everyday tools.', tags: ['Brand system', 'UX', 'Motion'] },
  { title: 'Quiet Signal', type: 'Work', year: '2024', color: '#6aa7c9', text: 'An exploration of calm interfaces, subtle feedback, and human-paced technology.', tags: ['Creative code', 'Three.js', 'Research'] },
  { title: 'Field Notes', type: 'Development', year: '2023', color: '#79ad89', text: 'A living archive for the references, lessons, and questions that keep me curious.', tags: ['Editorial', 'Web design', 'CMS'] },
]

const skills = [
  { name: 'JavaScript', short: 'JS', category: 'Language', color: '#f0c94b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', level: 'Advanced', experience: '3+ years', rating: '4.9', trend: 98, learned: 'Self-directed learning + production work', usedIn: 'Interactive portfolio work, dashboards, and web applications', useCase: 'The language behind responsive interfaces, browser interactions, and full-stack applications.', projects: ['Project Atlas', 'Quiet Signal'], note: 'Placeholder skill story — replace with your actual learning path and evidence.' },
  { name: 'React', short: '⚛', category: 'Frontend', color: '#61dafb', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', level: 'Advanced', experience: '2+ years', rating: '4.8', trend: 96, learned: 'Built through projects and component-driven UI practice', usedIn: 'Reusable interfaces, design systems, and client-side applications', useCase: 'Building fast, composable interfaces that can grow without becoming difficult to maintain.', projects: ['Project Atlas', 'Field Notes'], note: 'Placeholder skill story — add the exact projects and responsibilities later.' },
  { name: 'Node.js', short: 'N', category: 'Backend', color: '#7fcf74', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', level: 'Intermediate', experience: '2+ years', rating: '4.7', trend: 91, learned: 'Hands-on backend and API experiments', usedIn: 'APIs, integrations, authentication, and server-side tooling', useCase: 'Connecting interfaces to data, services, and the systems that make products work.', projects: ['Project Atlas'], note: 'Placeholder skill story — add your stack, services, and deployment details later.' },
  { name: 'UI / UX', short: 'UI', category: 'Design', color: '#f08bbd', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', level: 'Advanced', experience: '3+ years', rating: '4.9', trend: 94, learned: 'Design practice, critique, and shipping real interfaces', usedIn: 'Product flows, prototypes, visual systems, and interaction design', useCase: 'Making complex products feel clear, useful, and human to the people using them.', projects: ['Second Nature', 'Quiet Signal'], note: 'Placeholder skill story — add your process, tools, and case studies later.' },
  { name: 'Git', short: '⌘', category: 'Workflow', color: '#f05032', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', level: 'Advanced', experience: '3+ years', rating: '4.8', trend: 88, learned: 'Daily development workflow', usedIn: 'Version control, collaboration, reviews, and safe releases', useCase: 'Keeping work traceable and collaborative while moving quickly without losing context.', projects: ['All projects'], note: 'Placeholder skill story — add your preferred workflow and team experience later.' },
  { name: 'SQL', short: 'DB', category: 'Data', color: '#2f8ecb', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', level: 'Intermediate', experience: '1+ year', rating: '4.6', trend: 83, learned: 'Working with application data and structured systems', usedIn: 'Data modeling, querying, reporting, and application features', useCase: 'Turning raw records into reliable information a product can use.', projects: ['Project Atlas', 'Field Notes'], note: 'Placeholder skill story — add the databases and queries you have worked with later.' },
]

const getChairWorlds = (aspect) => {
  const radiusX = Math.max(4.2, Math.min(11.5, 5.3 * (aspect / 0.85)))
  const baseY = 0
  const radiusY = 3.8
  return [-1, -2 / 3, -1 / 3, 0, 1 / 3, 2 / 3, 1].map((slot) => {
    const x = radiusX * slot
    const depth = baseY + radiusY * Math.sqrt(1 - slot * slot)
    const z = -depth
    return { x, z, yaw: Math.atan2(-x, depth - 1.2) * 0.55 }
  })
}

function Avatar({ section, featured = false, onClick }) {
  return <button className={`avatar-button ${featured ? 'featured' : ''}`} onClick={onClick} style={{ '--avatar-color': section.color }} aria-label={`Open ${section.label}`} data-role={section.label}>
    <span className={`avatar ${section.outfit}`}>
      <span className="avatar-halo" />
      <span className="avatar-head"><span className="avatar-hair" /><span className="avatar-eye left" /><span className="avatar-eye right" /><span className="avatar-smile" /></span>
      <span className="avatar-neck" />
      <span className="avatar-body"><span className="avatar-detail" /></span>
      <span className="avatar-prop">{section.id === 'education' ? '✦' : section.id === 'projects' ? '⌁' : section.id === 'skills' ? '⌘' : section.id === 'achievements' ? '◆' : section.id === 'experience' ? '▣' : '＋'}</span>
    </span>
    <span className="avatar-label"><small>{section.eyebrow}</small>{section.label}</span>
  </button>
}

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return <footer className="site-footer">
    <div className="footer-mark" aria-hidden="true"><span /><span /></div>
    <div className="footer-wordmark" aria-hidden="true">Marmik</div>
    <div className="footer-center">
      <p>Made with curiosity</p>
      <p>100% Marmik</p>
      <div className="footer-icons" aria-label="Made with curiosity"><Eye size={20} /><Heart size={20} /><Sparkles size={20} /><Code2 size={20} /></div>
      <div className="footer-socials" aria-label="Social links"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><span className="social-letter">in</span></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" /></svg></a></div>
      <p>Designed &amp; built by</p>
      <strong>MARMIK</strong>
      <p>Always exploring.</p>
    </div>
    <div className="footer-meta footer-meta-left">Visual design &amp; creative code</div>
    <div className="footer-meta footer-meta-center">©2026 Marmik. All rights reserved.</div>
    <button className="footer-meta footer-meta-right" onClick={scrollToTop}>Back to top <ArrowUp size={18} /></button>
  </footer>
}

function ThreeConferenceChairs() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-5, 5, 7.5, -7.5, 0.1, 100)
    camera.position.set(0, 12, 22)
    camera.lookAt(0, 3.6, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    const chandelierHitArea = document.createElement('div')
    chandelierHitArea.className = 'chandelier-hit-area'
    chandelierHitArea.setAttribute('aria-label', 'Tilt the chandelier')
    mount.appendChild(chandelierHitArea)

    scene.add(new THREE.HemisphereLight(0xfff0d2, 0x17233f, 2.2))
    const key = new THREE.DirectionalLight(0xffd5a1, 3.4)
    key.position.set(-8, -10, 14)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x8bcfff, 1.7)
    fill.position.set(9, -2, 8)
    scene.add(fill)

    const chandelier = new THREE.Group()
    chandelier.position.set(0, 9, -1)
    const brass = new THREE.MeshStandardMaterial({ color: '#c9a66b', metalness: 0.55, roughness: 0.24 })
    const glass = new THREE.MeshPhysicalMaterial({ color: '#fff2d2', roughness: 0.2, metalness: 0.02, transmission: 0.18, thickness: 0.3, emissive: '#6b4b1e', emissiveIntensity: 0.12 })
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.055, 8, 48), brass)
    halo.rotation.x = Math.PI / 2
    halo.position.y = -0.1
    chandelier.add(halo)
    const suspension = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.1, 8), brass)
    suspension.position.y = 1.45
    chandelier.add(suspension)
    for (const x of [-0.92, 0, 0.92]) {
      const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), brass)
      drop.position.set(x, -0.65, 0)
      chandelier.add(drop)
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), glass)
      globe.position.set(x, -1.12, 0)
      chandelier.add(globe)
    }
    scene.add(chandelier)
    let targetTiltX = 0
    let targetTiltZ = 0
    let velocityX = 0
    let velocityZ = 0
    const updateTilt = (event) => {
      const bounds = chandelierHitArea.getBoundingClientRect()
      const nx = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      const ny = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
      targetTiltX = -ny * 0.2
      targetTiltZ = -nx * 0.22
    }
    const resetTilt = () => {
      targetTiltX = 0
      targetTiltZ = 0
    }
    chandelierHitArea.addEventListener('pointermove', updateTilt)
    chandelierHitArea.addEventListener('pointerleave', resetTilt)

    let currentChairWorlds = []
    const chairInstances = []
    let currentChairScale = 0.52
    const placeChair = (chair, { x, z, yaw }) => {
      // Keep the GLB's native Y-up axis vertical and place all legs on the
      // XZ floor plane. Rotate each seat inward around the vertical Y axis.
      chair.position.set(x, 0, z)
      chair.rotation.set(0, yaw, 0)
    }

    const resize = () => {
      const width = mount.clientWidth || 1
      const height = mount.clientHeight || 1
      const aspect = width / height
      const frustumHeight = 15
      camera.top = frustumHeight / 2
      camera.bottom = -frustumHeight / 2
      camera.left = -(frustumHeight * aspect) / 2
      camera.right = (frustumHeight * aspect) / 2
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      renderer.setSize(width, height, false)
      const bounds = [new THREE.Vector3(-1.9, 11.6, -1), new THREE.Vector3(1.9, 11.6, -1), new THREE.Vector3(-1.9, 7.5, -1), new THREE.Vector3(1.9, 7.5, -1)].map((point) => point.project(camera))
      const xs = bounds.map((point) => (point.x * 0.5 + 0.5) * width)
      const ys = bounds.map((point) => (-point.y * 0.5 + 0.5) * height)
      chandelierHitArea.style.left = `${Math.min(...xs)}px`
      chandelierHitArea.style.top = `${Math.min(...ys)}px`
      chandelierHitArea.style.width = `${Math.max(...xs) - Math.min(...xs)}px`
      chandelierHitArea.style.height = `${Math.max(...ys) - Math.min(...ys)}px`
      currentChairWorlds = getChairWorlds(aspect)
      currentChairScale = width < 700 ? 0.4 : 0.52
      chairInstances.forEach((chair, index) => {
        placeChair(chair, currentChairWorlds[index])
        chair.scale.setScalar(currentChairScale)
      })
    }
    resize()
    window.addEventListener('resize', resize)

    let disposed = false
    const colors = ['#e6a34d', '#d86b58', '#6aa7c9', '#b77bd1', '#79ad89', '#d7bd55', '#fff5df']
    const casterTireGeometry = new THREE.TorusGeometry(0.16, 0.055, 6, 10)
    casterTireGeometry.rotateY(Math.PI / 2)
    const casterHubGeometry = new THREE.CylinderGeometry(0.075, 0.075, 0.04, 10)
    casterHubGeometry.rotateZ(Math.PI / 2)
    const casterStemGeometry = new THREE.CylinderGeometry(0.045, 0.055, 0.18, 8)
    const armPadGeometry = new RoundedBoxGeometry(0.38, 0.16, 1.34, 4, 0.065)
    const tireMaterial = new THREE.MeshStandardMaterial({ color: '#353432', roughness: 0.72 })
    const metalDetailMaterial = new THREE.MeshStandardMaterial({ color: '#c9a66b', metalness: 0.38, roughness: 0.28 })
    const armPadMaterial = new THREE.MeshPhysicalMaterial({ color: '#ead9b8', roughness: 0.48, metalness: 0.01, clearcoat: 0.2, clearcoatRoughness: 0.45 })
    const loader = new GLTFLoader()
    loader.load('/models/conference-chair.glb', ({ scene: source }) => {
      if (disposed) return
      source.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = false
          object.receiveShadow = false
        }
      })

      currentChairWorlds.forEach((world, index) => {
        const chair = source.clone(true)
        const accent = new THREE.Color(colors[index])
        chair.traverse((object) => {
          if (!object.isMesh) return
          object.material = object.material.clone()
          const materialName = object.material.name.toLowerCase()
          const isTrim = materialName.includes('cream') || materialName.includes('white')
          if (isTrim) {
            object.material.color.set('#c9a66b')
            object.material.metalness = 0.38
            object.material.roughness = 0.28
          } else {
            object.material.color.copy(accent)
            object.material.metalness = 0.02
            object.material.roughness = 0.4
          }
        })
        const upholstery = new THREE.MeshPhysicalMaterial({
          color: accent.clone().lerp(new THREE.Color('#fff4dc'), 0.08),
          roughness: 0.62,
          metalness: 0.02,
          clearcoat: 0.16,
          clearcoatRoughness: 0.48,
        })
        const seatPadding = new THREE.Mesh(
          new RoundedBoxGeometry(2.55, 0.32, 2.22, 4, 0.12),
          upholstery,
        )
        seatPadding.position.set(0, 2.3, 0.08)
        seatPadding.castShadow = false
        seatPadding.receiveShadow = false
        chair.add(seatPadding)

        const backPadding = new THREE.Mesh(
          new RoundedBoxGeometry(2.55, 2.3, 0.3, 4, 0.13),
          upholstery.clone(),
        )
        backPadding.position.set(0, 3.85, -0.78)
        backPadding.castShadow = false
        backPadding.receiveShadow = false
        chair.add(backPadding)

        for (const side of [-1, 1]) {
          for (const end of [-1, 1]) {
            const x = side * 1.08
            const z = end * 0.92
            const tire = new THREE.Mesh(casterTireGeometry, tireMaterial)
            tire.position.set(x, 0.21, z)
            tire.castShadow = false
            tire.receiveShadow = false
            chair.add(tire)

            const hub = new THREE.Mesh(casterHubGeometry, metalDetailMaterial)
            hub.position.set(x, 0.21, z)
            hub.castShadow = false
            hub.receiveShadow = false
            chair.add(hub)

            const stem = new THREE.Mesh(casterStemGeometry, metalDetailMaterial)
            stem.position.set(x, 0.43, z)
            stem.castShadow = false
            stem.receiveShadow = false
            chair.add(stem)
          }
        }

        for (const side of [-1, 1]) {
          const armPad = new THREE.Mesh(armPadGeometry, armPadMaterial)
          armPad.position.set(side * 1.3, 3.39, -0.15)
          armPad.castShadow = false
          armPad.receiveShadow = false
          chair.add(armPad)
        }
        placeChair(chair, world)
        chair.scale.setScalar(currentChairScale)
        chairInstances.push(chair)
        scene.add(chair)
      })
    })

    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      velocityX = (velocityX + (targetTiltX - chandelier.rotation.x) * 0.14) * 0.72
      velocityZ = (velocityZ + (targetTiltZ - chandelier.rotation.z) * 0.14) * 0.72
      chandelier.rotation.x += velocityX
      chandelier.rotation.z += velocityZ
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      chandelierHitArea.removeEventListener('pointermove', updateTilt)
      chandelierHitArea.removeEventListener('pointerleave', resetTilt)
      chandelierHitArea.remove()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} className="three-chair-layer" aria-hidden="true" />
}

function TableScene({ light }) {
  return <><section className="scene-wrap funky-home" aria-label="Portfolio sections">
    <div className="funky-sun" /><div className="funky-wall-lines" /><div className="funky-star star-one">✦</div><div className="funky-star star-two">✦</div>
    <div className="funky-floor" />
    <div className="funky-table"><div className="funky-table-top" /><div className="funky-table-base" /><div className="funky-table-line" /></div>
    <ThreeConferenceChairs />
    <div className="funky-badge">CLICK<br />A CHARACTER</div><div className="funky-mode-label">{light ? 'DAY MODE' : 'NIGHT MODE'}</div>
  </section><Footer /></>
}

function Projects({ onBack }) {
  const [index, setIndex] = useState(0)
  const [filter, setFilter] = useState('All')
  const [grid, setGrid] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const lastWheel = useRef(0)
  const filters = ['All', 'Product', 'Personal', 'Work', 'Development', 'Research', '0–1']
  const filteredProjects = filter === 'All' ? projects : projects.filter(project => project.type === filter || project.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())))
  const project = filteredProjects[index % Math.max(filteredProjects.length, 1)] || projects[0]
  const change = (delta) => setIndex(current => (current + delta + filteredProjects.length) % filteredProjects.length)
  const handleWheel = (event) => {
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0
    if (Math.abs(horizontalDelta) < 12) return
    event.preventDefault()
    const now = Date.now()
    if (now - lastWheel.current < 450) return
    lastWheel.current = now
    change(horizontalDelta > 0 ? 1 : -1)
  }
  useEffect(() => { const handler = (e) => { if (e.key === 'ArrowLeft') change(-1); if (e.key === 'ArrowRight') change(1); if (e.key === 'Escape') onBack() }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [filter, filteredProjects.length])
  const selectFilter = (item) => { setFilter(item); setIndex(0) }
  return <main className="projects-page omaid-projects">
    <header className="projects-site-header"><button className="projects-brand" onClick={onBack}>MARMIK</button><nav><button className="active">PRODUCT DESIGN</button><button>GRAPHIC DESIGN</button><button>ABOUT</button></nav><button className="projects-back" onClick={onBack}>BACK TO TABLE</button></header>
    <section className="om-project-stage">
      <div className="stack-toolbar"><span className="stack-count">{String((index % Math.max(filteredProjects.length, 1)) + 1).padStart(2, '0')} — {project.title.toUpperCase()}</span><button className="grid-toggle" onClick={() => setGrid(!grid)}>{grid ? 'STACK VIEW' : 'GRID VIEW'} ↗</button></div>
      {grid ? <div className="projects-grid-view">{filteredProjects.map((item, itemIndex) => <button key={item.title} className="grid-project-card" style={{ '--project-color': item.color }} onClick={() => { setGrid(false); setIndex(itemIndex) }}><ProjectArtwork project={item} /><span>{item.title}</span></button>)}</div> : <div className="circle-area" onWheel={handleWheel} onPointerDown={event => setDragStart(event.clientX)} onPointerUp={event => { if (dragStart !== null && Math.abs(event.clientX - dragStart) > 40) change(event.clientX < dragStart ? 1 : -1); setDragStart(null) }}>{filteredProjects.map((item, itemIndex) => { const distance = (itemIndex - index + filteredProjects.length) % filteredProjects.length; const angle = distance === 0 ? 0 : (distance * 360 / filteredProjects.length) + 90; return <button key={item.title} className={`circle-card circle-card-${distance}`} style={{ '--project-color': item.color, '--circle-angle': `${angle}deg`, '--circle-order': filteredProjects.length - distance }} onClick={() => distance !== 0 && setIndex(itemIndex)} aria-label={`Open ${item.title}`}><ProjectArtwork project={item} /></button> })}<div className="circle-center-mark">{String((index % Math.max(filteredProjects.length, 1)) + 1).padStart(2, '0')}</div></div>}
    </section>
    <footer className="projects-filter-bar"><div className="project-filters">{filters.map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => selectFilter(item)}>{item}</button>)}</div><div className="project-nav-controls"><button onClick={() => change(-1)} aria-label="Previous project"><ArrowLeft size={16} /></button><span>{String((index % Math.max(filteredProjects.length, 1)) + 1).padStart(2, '0')} / {String(Math.max(filteredProjects.length, 1)).padStart(2, '0')}</span><button onClick={() => change(1)} aria-label="Next project"><ArrowRight size={16} /></button></div></footer>
  </main>
}

function ProjectArtwork({ project }) { return <div className="project-artwork" style={{ '--project-color': project.color }}><div className="artwork-noise" /><div className="artwork-window"><span /><span /><span /><b /><i /><em /></div><div className="artwork-shape shape-one" /><div className="artwork-shape shape-two" /><strong>{project.title.split(' ')[0]}</strong></div> }

function SkillsPage({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('trending')
  const [category, setCategory] = useState('All')
  const [showSort, setShowSort] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const categories = ['All', ...new Set(skills.map(skill => skill.category))]
  const visibleSkills = useMemo(() => skills.filter(skill => skill.name.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || skill.category === category)).sort((a, b) => sort === 'alphabetical' ? a.name.localeCompare(b.name) : b.trend - a.trend), [query, sort, category])
  const skill = selected ? skills.find(item => item.name === selected) : null
  return <main className="skills-page">
    <header className="page-nav"><button className="back-button" onClick={onBack}><span>←</span> Back to table</button><span className="nav-mark">MM / 03</span></header>
    <section className="skills-shell">
      <div className="skills-search"><span className="search-arrow">←</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search skills" aria-label="Search skills" />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}<span className="search-mic">⌕</span></div>
      <div className="skills-header"><div><p className="kicker">Marmik’s skill shelf</p><h1>Find a<br /><em>superpower.</em></h1></div><div className="skills-cart"><span className="cart-count">{visibleSkills.length}</span><span>Skills found</span></div></div>
      <div className="skills-toolbar"><div className="skills-toolbar-actions"><button className="shop-control" onClick={() => setShowFilters(!showFilters)}>☷ Filters <span>▾</span></button><div className="sort-control"><button className="shop-control" onClick={() => setShowSort(!showSort)}>↕ Sort <span>▾</span></button>{showSort && <div className="sort-menu"><button onClick={() => { setSort('trending'); setShowSort(false) }}>Most trending</button><button onClick={() => { setSort('alphabetical'); setShowSort(false) }}>Alphabetically</button></div>}</div></div><span className="toolbar-note">Click a skill to inspect the receipt</span></div>
      {showFilters && <div className="filter-row">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>}
      <div className="skills-grid">{visibleSkills.map(item => <button className="skill-product" key={item.name} onClick={() => setSelected(item.name)} style={{ '--skill-color': item.color }}><div className="product-image"><img src={item.icon} alt={`${item.name} logo`} /><span className="favorite">♡</span></div><div className="product-tags"><span>{item.category}</span><span>{item.level}</span></div><div className="product-bottom"><div><h2>{item.name}</h2><div className="product-rating"><b>★</b> {item.rating} <span>·</span> {item.trend}% trending</div></div><span className="product-add">+</span></div><div className="experience-line"><span>Experience</span><strong>{item.experience}</strong></div></button>)}</div>
      {!visibleSkills.length && <div className="empty-skills">No skills match “{query}”. Try another search.</div>}
    </section>
    {skill && <div className="skill-overlay" role="dialog" aria-modal="true" aria-label={`${skill.name} details`} onClick={() => setSelected(null)}><div className="skill-detail" onClick={event => event.stopPropagation()} style={{ '--skill-color': skill.color }}><button className="close-detail" onClick={() => setSelected(null)} aria-label="Close skill details"><X size={18} /></button><div className="detail-product-image"><img src={skill.icon} alt={`${skill.name} logo`} /></div><p className="kicker">{skill.category} / Skill receipt</p><h2>{skill.name}</h2><div className="skill-level"><span>Current level</span><b>{skill.level} · {skill.experience}</b></div><div className="skill-facts"><div><small>Where I learned it</small><p>{skill.learned}</p></div><div><small>Where I’ve used it</small><p>{skill.usedIn}</p></div><div><small>Real-world use case</small><p>{skill.useCase}</p></div><div><small>Projects</small><p className="skill-projects">{skill.projects.map(project => <span key={project}>{project}</span>)}</p></div></div><p className="skill-note">{skill.note}</p></div></div>}
  </main>
}

const educationEntries = [
  { year: '01', period: '2022 — PRESENT', title: 'Your degree / program', place: 'Add your university here', note: 'The foundation for the way I solve problems, make things, and keep asking better questions.', color: '#e6a34d', face: '●' },
  { year: '02', period: 'RECENT CHAPTER', title: 'A course worth keeping', place: 'Add a course or certification', note: 'A focused detour that gave me a new tool, a new lens, or a project I was proud to finish.', color: '#d86b58', face: '✦' },
  { year: '03', period: 'ALWAYS ON', title: 'Learning by making', place: 'Projects, experiments, and curiosity', note: 'The classroom continues in the browser: build, break, notice, repeat.', color: '#79ad89', face: '↗' },
]

function EducationPage({ onBack }) {
  const [selected, setSelected] = useState(null)
  const entry = selected !== null ? educationEntries[selected] : null
  return <main className="education-page">
    <header className="page-nav education-nav"><button className="back-button" onClick={onBack}><span>←</span> Back to table</button><span className="nav-mark">MM / 01</span></header>
    <section className="education-wall">
      <div className="education-intro">
        <p className="kicker">01 / Education</p>
        <h1>Things that<br /><em>shaped me.</em></h1>
        <p className="education-lede">A wall of places, ideas, and small breakthroughs that keep the work moving.</p>
        <span className="wall-instruction">Click a poster to open the note ↗</span>
      </div>
      <div className="poster-grid">
        {educationEntries.map((item, index) => <button className={`education-poster poster-${index + 1}`} key={item.year} style={{ '--poster-color': item.color }} onClick={() => setSelected(index)}>
          <span className="poster-tape" />
          <span className="poster-index">{item.year}</span>
          <span className="poster-face">{item.face}</span>
          <span className="poster-period">{item.period}</span>
          <strong>{item.title}</strong>
          <span className="poster-place">{item.place}</span>
          <span className="poster-arrow">↗</span>
        </button>)}
      </div>
      <div className="wall-doodle doodle-one">✦</div><div className="wall-doodle doodle-two">◎</div><div className="wall-doodle doodle-three">↗</div>
    </section>
    {entry && <div className="education-overlay" onClick={() => setSelected(null)}><article className="education-note" style={{ '--poster-color': entry.color }} onClick={event => event.stopPropagation()}>
      <button className="note-close" onClick={() => setSelected(null)}>Close ×</button>
      <span className="poster-index">{entry.year}</span><p className="kicker">{entry.period}</p><h2>{entry.title}</h2><p className="note-place">{entry.place}</p><div className="note-line" /><p>{entry.note}</p><span className="note-prompt">Replace this note with your own story.</span>
    </article></div>}
  </main>
}

function Detail({ section, onBack }) {
  return <main className="detail-page" style={{ '--detail-color': section.color }}><header className="page-nav"><button className="back-button" onClick={onBack}><span>←</span> Back to table</button><span className="nav-mark">MM / {section.eyebrow}</span></header><section className="detail-content"><div><p className="kicker">{section.eyebrow} / {section.label}</p><h1>{section.label}<br /><em>in progress.</em></h1><p className="detail-lede">{section.detail}</p></div><div className="detail-card"><div className={`mini-avatar ${section.outfit}`}><span className="avatar-head"><span className="avatar-hair" /><span className="avatar-eye left" /><span className="avatar-eye right" /></span><span className="avatar-body" /></div><p>Content for this chapter is taking shape.</p><span>Replace this with your story, timeline, and links.</span></div></section></main>
}

function Contact({ onBack }) { return <main className="contact-page"><header className="page-nav"><button className="back-button" onClick={onBack}><span>←</span> Back to table</button><span className="nav-mark">MM / 07</span></header><section className="contact-content"><p className="kicker">Say hello</p><h1>Let’s make<br /><em>something good.</em></h1><p className="contact-lede">Have a project, a question, or just a good idea? I’d love to hear it.</p><div className="contact-links"><a href="mailto:hello@example.com"><Mail size={18} /> hello@example.com</a><a href="https://github.com" target="_blank" rel="noreferrer"><Code2 size={18} /> GitHub</a></div></section></main> }

function App() {
  const [page, setPage] = useState('home')
  const [light, setLight] = useState(false)
  const go = (next) => setPage(next)
  if (page === 'projects') return <div className={light ? 'app light' : 'app'}><Projects onBack={() => go('home')} /></div>
  if (page === 'skills') return <div className={light ? 'app light' : 'app'}><SkillsPage onBack={() => go('home')} /></div>
  if (page === 'education') return <div className={light ? 'app light' : 'app'}><EducationPage onBack={() => go('home')} /></div>
  if (page === 'contact') return <div className={light ? 'app light' : 'app'}><Contact onBack={() => go('home')} /></div>
  if (page !== 'home') { const section = sections.find(item => item.id === page); return <div className={light ? 'app light' : 'app'}><Detail section={section} onBack={() => go('home')} /></div> }
  return <div className={light ? 'app light' : 'app'}><button className="theme-toggle icon-only" onClick={() => setLight(!light)} aria-label="Toggle color mode">{light ? <Moon size={17} /> : <Sun size={17} />}</button><TableScene light={light} onSelect={go} onContact={() => go('contact')} /></div>
}

createRoot(document.getElementById('root')).render(<App />)
