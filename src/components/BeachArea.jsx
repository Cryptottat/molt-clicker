import { useState, useEffect, useRef } from 'react'

function BeachArea({ upgrades, totalMolts, newMoltTrigger = 0 }) {
  const [creatures, setCreatures] = useState([])
  const [decorations, setDecorations] = useState([])
  const [unitMolts, setUnitMolts] = useState([])
  const [bigMolts, setBigMolts] = useState([])
  const [bubbles, setBubbles] = useState([])
  const [popups, setPopups] = useState([]) // +MPS popups
  const [mergeEffects, setMergeEffects] = useState([]) // Merge particles
  const animationRef = useRef(null)
  const lastTimeRef = useRef(Date.now())
  const entityIdRef = useRef(0)
  const lastTriggerRef = useRef(0)
  const isMergingRef = useRef(false)
  const audioCtxRef = useRef(null)

  // Initialize audio context
  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
  }, [])

  // Play tiny blip sound
  const playBlip = () => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05)
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime) // Very quiet
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  }

  // Initialize creatures based on upgrades
  useEffect(() => {
    const newCreatures = []
    const newDecorations = []
    let id = 0
    
    // 생물들 (움직임) - MPS 값도 저장
    for (let i = 0; i < Math.min(upgrades.submolt?.count || 0, 12); i++) {
      newCreatures.push({ id: id++, type: 'submolt', emoji: '🦐', x: Math.random() * 80 + 10, y: 55 + Math.random() * 30, vx: (Math.random() - 0.5) * 1.5, size: 16, mps: 0.1 })
    }
    for (let i = 0; i < Math.min(upgrades.agentClaw?.count || 0, 8); i++) {
      newCreatures.push({ id: id++, type: 'agent', emoji: '🦀', x: Math.random() * 75 + 10, y: 50 + Math.random() * 25, vx: (Math.random() - 0.5) * 1.2, size: 20, mps: 0.5 })
    }
    for (let i = 0; i < Math.min(upgrades.shark?.count || 0, 5); i++) {
      newCreatures.push({ id: id++, type: 'shark', emoji: '🦈', x: Math.random() * 70 + 15, y: 25 + Math.random() * 20, vx: (Math.random() - 0.5) * 2.5, size: 28, glow: true, mps: 25 })
    }
    for (let i = 0; i < Math.min(upgrades.clickBot?.count || 0, 6); i++) {
      newCreatures.push({ id: id++, type: 'bot', emoji: '🤖', x: Math.random() * 70 + 15, y: 40 + Math.random() * 25, vx: (Math.random() - 0.5) * 0.8, size: 18, mps: 1 })
    }
    for (let i = 0; i < Math.min(upgrades.quantumCore?.count || 0, 2); i++) {
      newCreatures.push({ id: id++, type: 'quantum', emoji: '⚛️', x: 25 + i * 45, y: 8 + Math.random() * 8, vx: (Math.random() - 0.5) * 0.5, size: 24, glow: true, mps: 150 })
    }
    
    // 고정 장치들
    for (let i = 0; i < Math.min(upgrades.aiServer?.count || 0, 4); i++) {
      newDecorations.push({ id: id++, type: 'server', emoji: '🖥️', x: 8 + i * 22, y: 12, size: 22, blink: true, mps: 2 })
    }
    for (let i = 0; i < Math.min(upgrades.hatchery?.count || 0, 3); i++) {
      newDecorations.push({ id: id++, type: 'hatchery', emoji: '🏭', x: 12 + i * 28, y: 22, size: 26, mps: 10 })
    }
    
    // 인테리어 - 해변 전체에 분산 배치
    for (let i = 0; i < Math.min(upgrades.seaweed?.count || 0, 10); i++) {
      newDecorations.push({ id: id++, type: 'seaweed', emoji: '🌿', x: 10 + Math.random() * 80, y: 50 + Math.random() * 40, size: 18 + Math.random() * 6, sway: true, mps: 0.05 })
    }
    for (let i = 0; i < Math.min(upgrades.rock?.count || 0, 8); i++) {
      newDecorations.push({ id: id++, type: 'rock', emoji: '🪨', x: 5 + Math.random() * 85, y: 65 + Math.random() * 25, size: 16 + Math.random() * 8 })
    }
    for (let i = 0; i < Math.min(upgrades.coral?.count || 0, 6); i++) {
      newDecorations.push({ id: id++, type: 'coral', emoji: '🪸', x: 10 + Math.random() * 80, y: 45 + Math.random() * 40, size: 20 + Math.random() * 8, glow: true, mps: 0.2 })
    }
    for (let i = 0; i < Math.min(upgrades.shell?.count || 0, 8); i++) {
      newDecorations.push({ id: id++, type: 'shell', emoji: '🐚', x: 5 + Math.random() * 88, y: 60 + Math.random() * 30, size: 14 + Math.random() * 6 })
    }
    for (let i = 0; i < Math.min(upgrades.treasure?.count || 0, 3); i++) {
      newDecorations.push({ id: id++, type: 'treasure', emoji: '📦', x: 15 + Math.random() * 70, y: 55 + Math.random() * 30, size: 24, glow: true, sparkle: true, mps: 1 })
    }
    
    setCreatures(newCreatures)
    setDecorations(newDecorations)
  }, [upgrades])

  // Spawn +MPS popups from creatures and decorations
  useEffect(() => {
    const spawnPopup = () => {
      const allProducers = [...creatures, ...decorations].filter(e => e.mps && e.mps > 0)
      
      if (allProducers.length > 0 && Math.random() < 0.3) {
        const producer = allProducers[Math.floor(Math.random() * allProducers.length)]
        
        const popup = {
          id: entityIdRef.current++,
          x: producer.x,
          y: producer.y,
          value: producer.mps,
          opacity: 1,
          offsetY: 0,
        }
        
        setPopups(prev => [...prev, popup])
        playBlip()
        
        // Remove after animation
        setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== popup.id))
        }, 1000)
      }
    }

    const interval = setInterval(spawnPopup, 600)
    return () => clearInterval(interval)
  }, [creatures, decorations])

  // Animate popups
  useEffect(() => {
    const animatePopups = () => {
      setPopups(prev => prev.map(p => ({
        ...p,
        offsetY: p.offsetY - 1,
        opacity: Math.max(0, p.opacity - 0.02),
      })))
    }
    
    const interval = setInterval(animatePopups, 30)
    return () => clearInterval(interval)
  }, [])

  // Spawn random bubbles occasionally
  useEffect(() => {
    const spawnBubble = () => {
      if (Math.random() < 0.15) {
        const newBubble = {
          id: entityIdRef.current++,
          x: Math.random() * 80 + 10,
          y: 100,
          size: 4 + Math.random() * 8,
          speed: 30 + Math.random() * 40,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 2 + Math.random() * 3,
        }
        setBubbles(prev => [...prev, newBubble])
      }
    }

    const interval = setInterval(spawnBubble, 800)
    return () => clearInterval(interval)
  }, [])

  // Play merge sound (level up!)
  const playMergeSound = () => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    // Ascending arpeggio
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.05)
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.15)
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  }

  // Spawn merge effect particles
  const spawnMergeEffect = (x, y, value) => {
    const particles = []
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12
      particles.push({
        id: entityIdRef.current++,
        x,
        y,
        angle,
        distance: 0,
        maxDistance: 20 + Math.random() * 30,
        opacity: 1,
        value,
      })
    }
    setMergeEffects(prev => [...prev, ...particles])
    playMergeSound()
    
    // Remove after animation
    setTimeout(() => {
      setMergeEffects(prev => prev.filter(p => !particles.find(np => np.id === p.id)))
    }, 500)
  }

  // Animate merge effects
  useEffect(() => {
    if (mergeEffects.length === 0) return
    
    const interval = setInterval(() => {
      setMergeEffects(prev => prev.map(p => ({
        ...p,
        distance: Math.min(p.distance + 2, p.maxDistance),
        opacity: Math.max(0, p.opacity - 0.05),
      })))
    }, 20)
    
    return () => clearInterval(interval)
  }, [mergeEffects.length])

  // Play drop sound
  const playDropSound = () => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08)
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  }

  // Handle click/auto - spawn 1단위 몰트
  useEffect(() => {
    if (newMoltTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = newMoltTrigger
      
      const newMolt = {
        id: entityIdRef.current++,
        value: 1,
        x: Math.random() * 70 + 15,
        y: -5,
        targetY: 70 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 1.5,
        falling: true,
      }
      
      setUnitMolts(prev => [...prev, newMolt])
      playDropSound()
    }
  }, [newMoltTrigger])

  // Merge 1단위 molts
  useEffect(() => {
    if (isMergingRef.current) return
    
    const landed = unitMolts.filter(m => !m.falling)
    
    if (landed.length >= 10) {
      isMergingRef.current = true
      
      const toRemoveIds = landed.slice(0, 10).map(m => m.id)
      
      setUnitMolts(prev => prev.filter(m => !toRemoveIds.includes(m.id)))
      
      const newX = 40 + Math.random() * 20
      const newY = 60 + Math.random() * 20
      
      setBigMolts(prev => [...prev, {
        id: entityIdRef.current++,
        value: 10,
        x: newX,
        y: newY,
        vx: (Math.random() - 0.5) * 1,
      }])
      
      // Spawn merge effect
      spawnMergeEffect(newX, newY, 10)
      
      setTimeout(() => { isMergingRef.current = false }, 100)
    }
  }, [unitMolts])

  // Merge bigMolts
  useEffect(() => {
    const counts = {}
    bigMolts.forEach(m => {
      counts[m.value] = (counts[m.value] || 0) + 1
    })
    
    for (const [val, count] of Object.entries(counts)) {
      if (count >= 10) {
        const value = parseInt(val)
        
        let removed = 0
        const filtered = bigMolts.filter(m => {
          if (m.value === value && removed < 10) {
            removed++
            return false
          }
          return true
        })
        
        const newX = 30 + Math.random() * 40
        const newY = 45 + Math.random() * 25
        
        filtered.push({
          id: entityIdRef.current++,
          value: value * 10,
          x: newX,
          y: newY,
          vx: (Math.random() - 0.5) * 0.8,
        })
        
        setBigMolts(filtered)
        spawnMergeEffect(newX, newY, value * 10)
        break
      }
    }
  }, [bigMolts])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      const delta = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      setCreatures(prev => prev.map(c => {
        let { x, vx } = c
        x += vx * delta * 30
        if (x < 5 || x > 92) { vx = -vx; x = Math.max(5, Math.min(92, x)) }
        if (Math.random() < 0.01) vx += (Math.random() - 0.5) * 0.5
        vx = Math.max(-3, Math.min(3, vx))
        return { ...c, x, vx }
      }))

      setUnitMolts(prev => prev.map(m => {
        let { x, y, vx, targetY, falling } = m
        
        if (falling) {
          y += delta * 150
          if (y >= targetY) {
            falling = false
            y = targetY
          }
        } else {
          x += vx * delta * 25
          if (x < 5 || x > 92) { vx = -vx; x = Math.max(5, Math.min(92, x)) }
          if (Math.random() < 0.02) vx = (Math.random() - 0.5) * 1.5
        }
        
        return { ...m, x, y, vx, falling }
      }))

      setBigMolts(prev => prev.map(m => {
        let { x, vx } = m
        x += vx * delta * 20
        if (x < 5 || x > 90) { vx = -vx; x = Math.max(5, Math.min(90, x)) }
        if (Math.random() < 0.015) vx = (Math.random() - 0.5) * 1
        return { ...m, x, vx }
      }))

      setBubbles(prev => {
        return prev
          .map(b => {
            let { x, y, wobble, wobbleSpeed, speed } = b
            y -= delta * speed
            wobble += delta * wobbleSpeed
            x += Math.sin(wobble) * delta * 15
            return { ...b, x, y, wobble }
          })
          .filter(b => b.y > -10)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const getSize = (value) => {
    if (value >= 1000000) return 64
    if (value >= 100000) return 56
    if (value >= 10000) return 48
    if (value >= 1000) return 40
    if (value >= 100) return 32
    if (value >= 10) return 24
    return 18
  }

  const formatValue = (value) => {
    if (value >= 1000000) return (value / 1000000) + 'M'
    if (value >= 1000) return (value / 1000) + 'K'
    if (value >= 10) return value.toString()
    return ''
  }

  const formatMps = (mps) => {
    if (mps >= 1) return `+${mps.toFixed(0)}`
    return `+${mps.toFixed(1)}`
  }

  return (
    <div 
      id="beach-area"
      className="relative w-full h-full bg-gradient-to-b from-slate-900 via-blue-950/60 to-amber-900/40 rounded-xl overflow-hidden border border-molt-accent/20"
    >
      {/* Title */}
      <div className="absolute top-2 left-2 z-20">
        <h3 className="font-display text-xs text-molt-accent/80">🏖️ CLAW BEACH</h3>
      </div>

      {/* Stats */}
      <div className="absolute top-2 right-2 z-20 text-right">
        <div className="text-[10px] text-gray-400">Total</div>
        <div className="font-mono text-molt-orange font-bold text-sm">{formatNumber(totalMolts)}</div>
      </div>

      {/* Sun */}
      <div className="absolute top-5 right-10 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-40 animate-pulse" />

      {/* Water line */}
      <div className="absolute top-[40%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Water */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-blue-900/70 to-transparent" />

      {/* Sand */}
      <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gradient-to-t from-amber-700/50 to-transparent" />

      {/* Bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(100,200,255,0.3))',
            boxShadow: '0 0 4px rgba(100,200,255,0.5)',
          }}
        />
      ))}

      {/* Merge Effects */}
      {mergeEffects.map(p => {
        const px = p.x + Math.cos(p.angle) * p.distance
        const py = p.y + Math.sin(p.angle) * p.distance
        return (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              opacity: p.opacity,
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: p.value >= 1000 ? '#ffd700' : p.value >= 100 ? '#ff6b35' : '#ff4d2a',
                boxShadow: `0 0 8px ${p.value >= 1000 ? '#ffd700' : p.value >= 100 ? '#ff6b35' : '#ff4d2a'}`,
              }}
            />
          </div>
        )
      })}

      {/* +MPS Popups */}
      {popups.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none font-mono font-bold text-green-400 text-xs"
          style={{
            left: `${p.x}%`,
            top: `calc(${p.y}% + ${p.offsetY}px)`,
            opacity: p.opacity,
            textShadow: '0 0 4px rgba(0,255,0,0.5)',
            zIndex: 30,
          }}
        >
          {formatMps(p.value)}
        </div>
      ))}

      {/* Decorations */}
      {decorations.map(d => (
        <div
          key={d.id}
          className={`absolute transition-none ${d.sway ? 'animate-pulse' : ''}`}
          style={{ 
            left: `${d.x}%`, 
            top: `${d.y}%`, 
            fontSize: d.size,
            animation: d.sway ? 'sway 3s ease-in-out infinite' : undefined,
          }}
        >
          {d.glow && (
            <div 
              className="absolute rounded-full blur-lg animate-pulse"
              style={{ 
                width: d.size * 1.5, 
                height: d.size * 1.5, 
                left: -d.size * 0.25,
                top: -d.size * 0.25,
                backgroundColor: d.type === 'coral' ? 'rgba(255, 100, 150, 0.4)' : 
                                 d.type === 'treasure' ? 'rgba(255, 215, 0, 0.5)' : 'rgba(100, 200, 255, 0.3)',
              }} 
            />
          )}
          {d.blink && <div className="absolute -top-1 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />}
          {d.sparkle && (
            <>
              <div className="absolute -top-1 -left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
            </>
          )}
          <span className="drop-shadow-md beach-emoji" style={{ fontSize: d.size }}>{d.emoji}</span>
        </div>
      ))}

      {/* Creatures */}
      {creatures.map(c => (
        <div
          key={c.id}
          className="absolute transition-none"
          style={{ 
            left: `${c.x}%`, 
            top: `${c.y}%`, 
            fontSize: c.size, 
            transform: `scaleX(${c.vx >= 0 ? 1 : -1})`,
            zIndex: c.type === 'shark' ? 15 : 10,
          }}
        >
          {c.glow && (
            <div 
              className="absolute rounded-full blur-lg animate-pulse"
              style={{ 
                width: c.size * 1.5, 
                height: c.size * 1.5, 
                left: -c.size * 0.25,
                top: -c.size * 0.25,
                backgroundColor: c.type === 'shark' ? 'rgba(100, 150, 200, 0.4)' : 'rgba(180, 100, 255, 0.4)',
              }} 
            />
          )}
          <span className="drop-shadow-md beach-emoji" style={{ fontSize: c.size }}>{c.emoji}</span>
        </div>
      ))}

      {/* 1-Unit Molts */}
      {unitMolts.map(m => (
        <div
          key={m.id}
          className="absolute transition-none z-20"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: `scaleX(${m.vx >= 0 ? -1 : 1})`,
          }}
        >
          <img 
            src="/claw.png" 
            alt="1 claw"
            className={`object-contain drop-shadow-lg ${m.falling ? 'animate-bounce' : ''}`}
            style={{ width: 18, height: 18 }}
          />
        </div>
      ))}

      {/* Big Molts */}
      {bigMolts.map(m => {
        const size = getSize(m.value)
        const label = formatValue(m.value)
        const glowIntensity = Math.min(Math.log10(m.value + 1) / 5, 1)
        
        return (
          <div
            key={m.id}
            className="absolute transition-none"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              transform: `scaleX(${m.vx >= 0 ? -1 : 1})`,
              zIndex: Math.floor(Math.log10(m.value + 1) * 10),
            }}
          >
            {m.value >= 100 && (
              <div 
                className="absolute rounded-full blur-lg animate-pulse"
                style={{ 
                  width: size * 1.5, 
                  height: size * 1.5, 
                  left: -size * 0.25,
                  top: -size * 0.25,
                  backgroundColor: `rgba(255, 77, 42, ${glowIntensity * 0.6})`,
                }} 
              />
            )}
            
            <img 
              src="/claw.png" 
              alt={`${m.value} claw`}
              className="object-contain drop-shadow-lg"
              style={{ width: size, height: size }}
            />
            
            {label && (
              <div 
                className="absolute -top-1 -right-1 bg-molt-accent text-white font-bold rounded px-0.5 whitespace-nowrap"
                style={{ fontSize: Math.max(8, size / 4) }}
              >
                {label}
              </div>
            )}
          </div>
        )
      })}

      {/* Empty state */}
      {creatures.length === 0 && decorations.length === 0 && unitMolts.length === 0 && bigMolts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 text-xs">
            <div className="text-xl mb-1">🏝️</div>
            <div>Click to populate!</div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return Math.floor(num).toString()
}

export default BeachArea
