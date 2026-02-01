import { useState, useEffect, useCallback } from 'react'

function WalletConnect({ connected, address, onConnect, onDisconnect }) {
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)

  useEffect(() => {
    const checkPhantom = () => {
      const isInstalled = window?.solana?.isPhantom
      setIsPhantomInstalled(!!isInstalled)
    }
    
    checkPhantom()
    const timeout = setTimeout(checkPhantom, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      if (window?.solana?.isPhantom) {
        const response = await window.solana.connect()
        const publicKey = response.publicKey.toString()
        onConnect(publicKey)
      } else {
        window.open('https://phantom.app/', '_blank')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }, [onConnect])

  const disconnectWallet = useCallback(async () => {
    try {
      if (window?.solana) {
        await window.solana.disconnect()
      }
      onDisconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }, [onDisconnect])

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 4)}..${addr.slice(-4)}`
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/50">
          <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
          <span className="text-green-400 text-xs">{shortenAddress(address)}</span>
        </div>
        <div className="px-1.5 py-0.5 bg-molt-accent/20 text-molt-accent text-[8px]">+5%</div>
        <button
          onClick={disconnectWallet}
          className="px-1.5 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] hover:bg-red-500/30"
        >
          X
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connectWallet}
      className="px-2 py-1 bg-molt-dark/50 border border-gray-600 text-gray-300 text-[10px] hover:border-molt-accent hover:text-molt-accent transition-all"
    >
      {isPhantomInstalled ? '👻 Connect' : '👻 Phantom'}
    </button>
  )
}

export default WalletConnect
