import { useState } from 'react'
import TwitterShare from './TwitterShare'

const CATEGORIES = {
  production: { name: 'Production', icon: '🦐', desc: 'Auto MPS generators' },
  automation: { name: 'Click+', icon: '🤖', desc: 'Click power bonus' },
  multiplier: { name: 'Multiply', icon: '✨', desc: 'Multipliers stack!' },
  decor: { name: 'Decor', icon: '🌊', desc: 'Ocean interior + bonus' },
  special: { name: 'Special', icon: '🌟', desc: 'Rare & powerful' },
}

const UPGRADE_CATEGORIES = {
  submolt: 'production',
  agentClaw: 'production',
  aiServer: 'production',
  hatchery: 'production',
  shark: 'production',
  clickBot: 'automation',
  autoClicker: 'automation',
  doubleClick: 'multiplier',
  tripleClick: 'multiplier',
  goldenClaw: 'multiplier',
  moltMultiplier: 'multiplier',
  seaweed: 'decor',
  rock: 'decor',
  coral: 'decor',
  shell: 'decor',
  treasure: 'decor',
  quantumCore: 'special',
  timeWarp: 'special',
}

const ICONS = {
  submolt: '🦐', agentClaw: '🦀', aiServer: '🖥️', hatchery: '🏭', shark: '🦈',
  clickBot: '🤖', autoClicker: '👆', doubleClick: '✌️', tripleClick: '🤟',
  goldenClaw: '🦞', moltMultiplier: '💎', quantumCore: '⚛️', timeWarp: '⏰',
  seaweed: '🌿', rock: '🪨', coral: '🪸', shell: '🐚', treasure: '📦',
}

function UpgradeShop({ upgrades, molts, mps, getUpgradeCost, purchaseUpgrade }) {
  const [activeCategory, setActiveCategory] = useState('production')

  const fmt = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toFixed(0)
  }

  const filtered = Object.entries(upgrades).filter(([k]) => UPGRADE_CATEGORIES[k] === activeCategory)
  const getCount = (cat) => Object.entries(upgrades).filter(([k]) => UPGRADE_CATEGORIES[k] === cat).reduce((s, [, v]) => s + v.count, 0)

  const getEffect = (u) => {
    const effects = []
    if (u.mps) effects.push(`+${u.mps} MPS`)
    if (u.clickBonus) effects.push(`+${u.clickBonus}/click`)
    if (u.clickMult) effects.push(`×${u.clickMult} click`)
    if (u.prodMult) effects.push(`×${u.prodMult} prod`)
    return effects.join(', ') || ''
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-2">
        <h2 className="font-display text-lg text-molt-accent flex items-center gap-2">
          🏪 SHOP
        </h2>
        <div className="text-xs text-gray-400">
          Balance: <span className="text-molt-orange font-mono font-bold">{fmt(molts)}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {Object.entries(CATEGORIES).map(([k, cat]) => (
          <button
            key={k}
            onClick={() => setActiveCategory(k)}
            className={`p-1.5 rounded-lg text-center transition-all border
              ${activeCategory === k 
                ? 'bg-molt-accent/20 border-molt-accent text-white' 
                : 'bg-molt-dark/50 border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            <div className="text-lg">{cat.icon}</div>
            <div className="text-[9px] font-display">{cat.name}</div>
            {getCount(k) > 0 && <div className="text-[8px] text-molt-orange">{getCount(k)}</div>}
          </button>
        ))}
      </div>

      {/* Desc */}
      <div className="text-xs text-gray-400 mb-2 px-2 py-1 bg-molt-dark/30 rounded border border-molt-accent/10">
        {CATEGORIES[activeCategory].desc}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {filtered.map(([key, u]) => {
          const cost = getUpgradeCost(key)
          const can = molts >= cost

          return (
            <button
              key={key}
              onClick={() => purchaseUpgrade(key)}
              disabled={!can}
              className={`w-full p-2.5 rounded-lg border text-left transition-all
                ${can 
                  ? 'bg-molt-dark/50 border-molt-accent/30 hover:bg-molt-accent/10 hover:border-molt-accent' 
                  : 'bg-molt-dark/30 border-gray-700/50 opacity-50'}`}
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-molt-gray/50 rounded-lg">
                  {ICONS[key]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-sm text-white font-bold truncate">{u.name}</span>
                    <span className="text-xs text-molt-accent bg-molt-accent/20 px-1.5 rounded">×{u.count}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{u.description}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`font-mono text-xs font-bold ${can ? 'text-green-400' : 'text-red-400'}`}>
                      💰{fmt(cost)}
                    </span>
                    <span className="text-xs text-molt-orange font-bold">{getEffect(u)}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Twitter */}
      <div className="mt-2 pt-2 border-t border-molt-accent/20">
        <TwitterShare molts={molts} mps={mps} upgrades={upgrades} />
      </div>

      {/* Tips */}
      <div className="mt-2 p-2 rounded-lg bg-molt-accent/10 border border-molt-accent/20 text-[10px] text-gray-400">
        💡 Cost +12% each • Wallet +5% • Multipliers stack!
      </div>
    </div>
  )
}

export default UpgradeShop
