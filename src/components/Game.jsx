import { useState, useEffect, useCallback, useRef } from 'react'
import WalletConnect from './WalletConnect'
import ClickerArea from './ClickerArea'
import UpgradeShop from './UpgradeShop'
import StatsDisplay from './StatsDisplay'
import BeachArea from './BeachArea'

const SAVE_KEY = 'molt_clicker_save_v4'
const YOUTUBE_VIDEO_ID = '8JY0ugUuFuE'

const INITIAL_UPGRADES = {
  // Production
  submolt: { count: 0, baseCost: 10, mps: 0.1, name: 'Submolt', description: 'Tiny shrimp worker' },
  agentClaw: { count: 0, baseCost: 50, mps: 0.5, name: 'Agent Claw', description: 'Crab operator' },
  aiServer: { count: 0, baseCost: 200, mps: 2, name: 'AI Server', description: 'Neural network' },
  hatchery: { count: 0, baseCost: 1000, mps: 10, name: 'Hatchery', description: 'Mass production' },
  shark: { count: 0, baseCost: 3000, mps: 25, name: 'Shark Hunter', description: 'Apex predator harvesting' },
  
  // Automation
  clickBot: { count: 0, baseCost: 100, mps: 1, clickBonus: 1, name: 'Click Bot', description: '+1 per click' },
  autoClicker: { count: 0, baseCost: 500, mps: 5, clickBonus: 3, name: 'Auto Clicker', description: '+3 per click' },
  
  // Multipliers (balanced - diminishing returns)
  doubleClick: { count: 0, baseCost: 500, mps: 0, clickMult: 1.5, name: 'Power Click', description: '+50% click power' },
  tripleClick: { count: 0, baseCost: 2500, mps: 0, clickMult: 1.5, name: 'Super Click', description: '+50% click power' },
  goldenClaw: { count: 0, baseCost: 5000, mps: 0, prodMult: 1.1, name: 'Golden Claw', description: '+10% production' },
  moltMultiplier: { count: 0, baseCost: 25000, mps: 0, prodMult: 1.15, name: 'Claw Boost', description: '+15% production' },
  
  // Decor
  seaweed: { count: 0, baseCost: 25, mps: 0.05, name: 'Seaweed', description: 'Ocean plant, tiny MPS' },
  rock: { count: 0, baseCost: 50, clickBonus: 0.5, name: 'Rock', description: 'Sturdy stone +0.5 click' },
  coral: { count: 0, baseCost: 200, mps: 0.3, name: 'Coral Reef', description: 'Pretty coral +0.3 MPS' },
  shell: { count: 0, baseCost: 80, clickBonus: 1, name: 'Giant Shell', description: '+1 per click' },
  treasure: { count: 0, baseCost: 1000, mps: 2, name: 'Treasure Chest', description: 'Hidden treasure +2 MPS' },
  
  // Special
  quantumCore: { count: 0, baseCost: 15000, mps: 150, name: 'Quantum Core', description: 'Quantum harvesting' },
  timeWarp: { count: 0, baseCost: 50000, mps: 200, name: 'Time Warp', description: 'Time manipulation' },
}

function Game() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [molts, setMolts] = useState(0)
  const [totalMolts, setTotalMolts] = useState(0)
  const [upgrades, setUpgrades] = useState(INITIAL_UPGRADES)
  const [particles, setParticles] = useState([])
  const [clickPower, setClickPower] = useState(1)
  const [clickTrigger, setClickTrigger] = useState(0)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const particleId = useRef(0)
  const playerRef = useRef(null)
  const clickSoundRef = useRef(null)

  const memberBonus = walletConnected ? 1.05 : 1

  // Initialize click sound
  useEffect(() => {
    // Create click sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    clickSoundRef.current = audioContext
  }, [])

  // Play click sound
  const playClickSound = useCallback(() => {
    if (!clickSoundRef.current) return
    const ctx = clickSoundRef.current
    if (ctx.state === 'suspended') ctx.resume()
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [])

  // Initialize YouTube Player
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(tag, firstScript)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => {
            playerRef.current.setVolume(30)
          },
        },
      })
    }
  }, [])

  // Toggle music
  const toggleMusic = useCallback(() => {
    if (!playerRef.current) return
    
    if (musicPlaying) {
      playerRef.current.pauseVideo()
      setMusicPlaying(false)
    } else {
      playerRef.current.playVideo()
      setMusicPlaying(true)
    }
  }, [musicPlaying])

  // Calculate production multiplier
  const calculateProdMult = useCallback(() => {
    let mult = 1
    if (upgrades.goldenClaw?.count > 0) mult *= Math.pow(1.5, upgrades.goldenClaw.count)
    if (upgrades.moltMultiplier?.count > 0) mult *= Math.pow(2, upgrades.moltMultiplier.count)
    if (upgrades.coral?.count > 0) mult *= Math.pow(1.02, upgrades.coral.count)
    if (upgrades.treasure?.count > 0) mult *= Math.pow(1.1, upgrades.treasure.count)
    return mult * memberBonus
  }, [upgrades, memberBonus])

  // Calculate click multiplier
  const calculateClickMult = useCallback(() => {
    let mult = 1
    if (upgrades.doubleClick?.count > 0) mult *= Math.pow(2, upgrades.doubleClick.count)
    if (upgrades.tripleClick?.count > 0) mult *= Math.pow(3, upgrades.tripleClick.count)
    return mult
  }, [upgrades])

  // Calculate MPS
  const calculateMPS = useCallback(() => {
    let mps = 0
    Object.values(upgrades).forEach(u => {
      if (u.mps) mps += u.count * u.mps
    })
    return mps * calculateProdMult()
  }, [upgrades, calculateProdMult])

  // Calculate click power
  useEffect(() => {
    let power = 1
    Object.values(upgrades).forEach(u => {
      if (u.clickBonus) power += u.count * u.clickBonus
    })
    setClickPower(power * calculateClickMult() * memberBonus)
  }, [upgrades, calculateClickMult, memberBonus])

  const mps = calculateMPS()

  // Load save
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setMolts(data.molts || 0)
        setTotalMolts(data.totalMolts || 0)
        if (data.upgrades) {
          setUpgrades(prev => {
            const merged = { ...prev }
            Object.keys(data.upgrades).forEach(key => {
              if (merged[key]) merged[key] = { ...merged[key], count: data.upgrades[key].count || 0 }
            })
            return merged
          })
        }
      } catch (e) { console.error(e) }
    }
  }, [])

  // Save
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      molts, totalMolts,
      upgrades: Object.fromEntries(Object.entries(upgrades).map(([k, v]) => [k, { count: v.count }]))
    }))
  }, [molts, totalMolts, upgrades])

  // Auto-increment (MPS) + trigger falling claws
  useEffect(() => {
    const interval = setInterval(() => {
      if (mps > 0) {
        const gain = mps / 10
        setMolts(prev => prev + gain)
        setTotalMolts(prev => prev + gain)
        // Trigger falling claw occasionally based on MPS
        if (Math.random() < Math.min(mps / 50, 0.5)) {
          setClickTrigger(prev => prev + 1)
        }
      }
    }, 100)
    return () => clearInterval(interval)
  }, [mps])

  // Handle click
  const handleClick = useCallback((e) => {
    // Play click sound
    playClickSound()
    
    // Start music on first click
    if (!musicStarted && playerRef.current) {
      playerRef.current.playVideo()
      setMusicPlaying(true)
      setMusicStarted(true)
    }

    setMolts(prev => prev + clickPower)
    setTotalMolts(prev => prev + clickPower)
    setClickTrigger(prev => prev + 1)

    const id = particleId.current++
    const rect = e.currentTarget.getBoundingClientRect()
    setParticles(prev => [...prev, { 
      id, 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top, 
      value: `+${clickPower.toFixed(0)}` 
    }])
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 600)
  }, [clickPower, musicStarted, playClickSound])

  // Get cost (multipliers have steeper cost curve)
  const getUpgradeCost = useCallback((key) => {
    const u = upgrades[key]
    const isMultiplier = ['doubleClick', 'tripleClick', 'goldenClaw', 'moltMultiplier'].includes(key)
    const growthRate = isMultiplier ? 1.8 : 1.12
    return Math.floor(u.baseCost * Math.pow(growthRate, u.count))
  }, [upgrades])

  // Purchase
  const purchaseUpgrade = useCallback((key) => {
    const cost = getUpgradeCost(key)
    if (molts >= cost) {
      setMolts(prev => prev - cost)
      setUpgrades(prev => ({
        ...prev,
        [key]: { ...prev[key], count: prev[key].count + 1 }
      }))
    }
  }, [molts, getUpgradeCost])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Hidden YouTube Player */}
      <div id="youtube-player" style={{ position: 'absolute', top: -9999, left: -9999 }} />

      {/* Header */}
      <header className="flex-shrink-0 flex justify-between items-center px-2 py-1 border-b-2 border-molt-accent/30 bg-molt-dark/95">
        {/* Left - Logo */}
        <div className="flex items-center gap-1">
          <img src="/claw.png" alt="Claw" className="w-6 h-6" />
          <h1 className="font-display text-sm font-bold text-molt-accent">CLAW CLICKER</h1>
        </div>
        
        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Twitter/X */}
          <a
            href="https://x.com/clawclicker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all
                       bg-molt-dark/50 border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/clawclicker/clawclicker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all
                       bg-molt-dark/50 border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>

          {/* Music Control */}
          <button
            onClick={toggleMusic}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
              musicPlaying 
                ? 'bg-molt-accent/20 border-molt-accent text-molt-accent' 
                : 'bg-molt-dark/50 border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
            title={musicPlaying ? 'Music On' : 'Music Off'}
          >
            <span className="text-sm">{musicPlaying ? '🔊' : '🔇'}</span>
          </button>
          
          <WalletConnect 
            connected={walletConnected}
            address={walletAddress}
            onConnect={(addr) => { setWalletConnected(true); setWalletAddress(addr) }}
            onDisconnect={() => { setWalletConnected(false); setWalletAddress('') }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex min-h-0">
        {/* Left - Beach */}
        <div className="w-[28%] p-2 min-w-[220px]">
          <BeachArea 
            upgrades={upgrades} 
            totalMolts={totalMolts}
            newMoltTrigger={clickTrigger}
          />
        </div>

        {/* Center - Clicker + 구매 현황 */}
        <div 
          id="clicker-area" 
          className="w-[28%] flex flex-col items-center justify-center p-3 border-x border-molt-accent/10 min-w-[220px]"
        >
          <StatsDisplay molts={molts} mps={mps} connected={walletConnected} clickPower={clickPower} />
          <ClickerArea onCl={handleClick} particles={particles} />
          
          {/* 구매 현황 */}
          <div className="mt-4 w-full">
            <div className="text-[10px] text-gray-500 text-center mb-2">OWNED UPGRADES</div>
            <div className="grid grid-cols-4 gap-1">
              <MiniStat icon="🦐" label="Submolt" value={upgrades.submolt?.count || 0} />
              <MiniStat icon="🦀" label="Agent" value={upgrades.agentClaw?.count || 0} />
              <MiniStat icon="🦈" label="Shark" value={upgrades.shark?.count || 0} />
              <MiniStat icon="🖥️" label="Server" value={upgrades.aiServer?.count || 0} />
              <MiniStat icon="🌿" label="Seaweed" value={upgrades.seaweed?.count || 0} />
              <MiniStat icon="🪨" label="Rock" value={upgrades.rock?.count || 0} />
              <MiniStat icon="🪸" label="Coral" value={upgrades.coral?.count || 0} />
              <MiniStat icon="🐚" label="Shell" value={upgrades.shell?.count || 0} />
            </div>
          </div>
        </div>

        {/* Right - Shop */}
        <aside className="flex-1 bg-molt-gray/50 p-3 overflow-y-auto">
          <UpgradeShop
            upgrades={upgrades}
            molts={molts}
            mps={mps}
            getUpgradeCost={getUpgradeCost}
            purchaseUpgrade={purchaseUpgrade}
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 text-center py-1 text-gray-500 text-xs border-t border-molt-accent/10 bg-molt-dark/80">
        🦞 Clawbook & OpenClaw | MPS: <span className="text-molt-accent">{mps.toFixed(1)}</span> | Click: <span className="text-green-400">+{clickPower.toFixed(1)}</span>
      </footer>
    </div>
  )
}

function MiniStat({ icon, label, value }) {
  if (value === 0) return (
    <div className="bg-molt-dark/30 rounded p-1 text-center opacity-40">
      <div className="text-sm">{icon}</div>
      <div className="text-[8px] text-gray-600">{label}</div>
    </div>
  )
  
  return (
    <div className="bg-molt-dark/50 rounded p-1 text-center border border-molt-accent/30">
      <div className="text-sm">{icon}</div>
      <div className="font-mono text-[10px] text-molt-orange font-bold">{value}</div>
    </div>
  )
}

export default Game
