import { useState, useEffect } from 'react'

function ClickerArea({ onCl, particles }) {
  const [isClicking, setIsClicking] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dir, setDir] = useState(1)
  const [sparkles, setSparkles] = useState([])

  // Wandering
  useEffect(() => {
    const interval = setInterval(() => {
      const newX = (Math.random() - 0.5) * 20
      const newY = (Math.random() - 0.5) * 15
      setDir(newX > pos.x ? 1 : -1)
      setPos({ x: newX, y: newY })
    }, 2500)
    return () => clearInterval(interval)
  }, [pos.x])

  const handleClick = (e) => {
    setIsClicking(true)
    onCl(e)
    
    // Create sparkle particles
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    
    const newSparkles = []
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5
      const distance = 30 + Math.random() * 40
      newSparkles.push({
        id: Date.now() + i,
        x: cx,
        y: cy,
        tx: cx + Math.cos(angle) * distance,
        ty: cy + Math.sin(angle) * distance,
        size: 4 + Math.random() * 4,
        color: ['#ff4d2a', '#ff6b35', '#ffa500', '#ffff00'][Math.floor(Math.random() * 4)],
      })
    }
    setSparkles(prev => [...prev, ...newSparkles])
    
    setTimeout(() => setIsClicking(false), 100)
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)))
    }, 400)
  }

  return (
    <div 
      className="relative w-40 h-40 flex items-center justify-center cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-molt-accent/20 blur-2xl animate-pulse" />
      
      {/* Rings */}
      <div className="absolute inset-2 rounded-full border border-molt-accent/30" />
      <div className="absolute inset-4 rounded-full border border-molt-accent/20" />

      {/* Click ripple */}
      {isClicking && (
        <div className="absolute inset-0 rounded-full border-2 border-molt-accent animate-ping" />
      )}

      {/* Claw */}
      <div
        className={`relative z-10 transition-all duration-100 ${isClicking ? 'scale-90' : ''}`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scaleX(${dir})` }}
      >
        <img
          src="/clawbig.png"
          alt="Click!"
          className="w-28 h-28 object-contain drop-shadow-[0_0_20px_rgba(255,77,42,0.5)] hover:drop-shadow-[0_0_30px_rgba(255,77,42,0.7)]"
          draggable={false}
        />
      </div>

      {/* Sparkle particles */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full pointer-events-none animate-[sparkle_0.4s_ease-out_forwards]"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size}px ${s.color}`,
            '--tx': `${s.tx - s.x}px`,
            '--ty': `${s.ty - s.y}px`,
          }}
        />
      ))}

      {/* +Value Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute text-molt-accent font-bold font-mono text-lg pointer-events-none animate-[particleBurst_0.6s_ease-out_forwards]"
          style={{ left: p.x, top: p.y, textShadow: '0 0 10px rgba(255,77,42,0.8)' }}
        >
          {p.value}
        </div>
      ))}

      <div className="absolute -bottom-4 text-gray-500 text-[10px]">Click to claw!</div>

      <style>{`
        @keyframes particleBurst {
          0% { opacity: 1; transform: translateY(0) scale(1.2); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.5); }
        }
        @keyframes sparkle {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
      `}</style>
    </div>
  )
}

export default ClickerArea
