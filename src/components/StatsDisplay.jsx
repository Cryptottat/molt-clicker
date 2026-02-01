function StatsDisplay({ molts, mps, connected, clickPower = 1 }) {
  const fmt = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
    return n.toFixed(1)
  }

  return (
    <div className="text-center mb-4">
      {/* Counter */}
      <div className="font-display text-4xl font-bold text-white text-glow mb-1">
        {fmt(molts)}
      </div>
      <div className="text-molt-accent font-display text-sm tracking-widest mb-3">CLAWS</div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <div className="px-2 py-1 bg-molt-dark/50 rounded border border-molt-accent/20">
          <span className="text-gray-500">MPS </span>
          <span className="font-mono text-molt-orange font-bold">{fmt(mps)}</span>
        </div>
        <div className="px-2 py-1 bg-molt-dark/50 rounded border border-molt-accent/20">
          <span className="text-gray-500">Click </span>
          <span className="font-mono text-green-400 font-bold">+{fmt(clickPower)}</span>
        </div>
      </div>

      {connected && (
        <div className="mt-2 text-green-400 text-[10px] flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          +5% Bonus
        </div>
      )}
    </div>
  )
}

export default StatsDisplay
