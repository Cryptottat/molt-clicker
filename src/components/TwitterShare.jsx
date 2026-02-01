import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas'

function TwitterShare({ molts, mps, upgrades }) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [copied, setCopied] = useState(false)

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return Math.floor(num).toString()
  }

  const getTotalUpgrades = () => {
    return Object.values(upgrades).reduce((sum, u) => sum + (u.count || 0), 0)
  }

  const getTweetText = () => {
    return `🦀 CLAW CLICKER 🦀

💰 ${formatNumber(molts)} Claws
⚡ ${formatNumber(mps)} CPS
🏭 ${getTotalUpgrades()} Upgrades

Can you beat my score?

🎮 https://clawclicker.fun

#ClawClicker $CLAWCLK`
  }

  // Capture screenshot and share
  const captureAndShare = useCallback(async () => {
    setIsCapturing(true)
    
    try {
      // Get the beach and clicker areas directly
      const beachEl = document.getElementById('beach-area')
      const clickerEl = document.getElementById('clicker-area')
      
      if (!beachEl || !clickerEl) {
        throw new Error('Elements not found')
      }

      // Capture beach area
      const beachCanvas = await html2canvas(beachEl, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
      
      // Capture clicker area
      const clickerCanvas = await html2canvas(clickerEl, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      // Combine into one canvas
      const finalCanvas = document.createElement('canvas')
      const padding = 20
      finalCanvas.width = beachCanvas.width + clickerCanvas.width + padding * 3
      finalCanvas.height = Math.max(beachCanvas.height, clickerCanvas.height) + padding * 2
      
      const ctx = finalCanvas.getContext('2d')
      
      // Background
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
      
      // Border
      ctx.strokeStyle = '#ff4d2a'
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, finalCanvas.width - 4, finalCanvas.height - 4)
      
      // Draw beach
      ctx.drawImage(beachCanvas, padding, padding)
      
      // Draw clicker
      ctx.drawImage(clickerCanvas, beachCanvas.width + padding * 2, padding)

      // Convert to blob
      const blob = await new Promise(resolve => finalCanvas.toBlob(resolve, 'image/png'))
      
      // Copy image to clipboard
      let clipboardSuccess = false
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])
        clipboardSuccess = true
        setCopied(true)
        setTimeout(() => setCopied(false), 5000)
      } catch (err) {
        console.log('Clipboard failed:', err)
        // Download instead
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `molt-clicker-${formatNumber(molts)}.png`
        a.click()
        URL.revokeObjectURL(url)
      }

      // Open Twitter
      const tweetText = getTweetText()
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
      window.open(twitterUrl, '_blank', 'width=600,height=500')
      
      setIsCapturing(false)
      
    } catch (error) {
      console.error('Capture failed:', error)
      setIsCapturing(false)
      
      // Fallback: just share text
      const tweetText = getTweetText()
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
      window.open(twitterUrl, '_blank', 'width=600,height=500')
    }
  }, [molts, mps, upgrades])

  return (
    <div className="space-y-1">
      <button
        onClick={captureAndShare}
        disabled={isCapturing}
        className={`w-full p-2.5 rounded-lg bg-[#1DA1F2]/20 border border-[#1DA1F2]/50 
                   hover:bg-[#1DA1F2]/30 transition-all flex items-center justify-center gap-2
                   text-[#1DA1F2] font-display text-sm
                   ${isCapturing ? 'opacity-50' : ''}`}
      >
        {isCapturing ? (
          <>
            <div className="w-4 h-4 border-2 border-[#1DA1F2] border-t-transparent rounded-full animate-spin" />
            Capturing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            📸 Share on X
          </>
        )}
      </button>
      
      {copied && (
        <div className="text-center text-xs text-green-400 bg-green-500/10 rounded p-1.5 border border-green-500/30">
          ✅ Image copied! Press <span className="font-bold">Ctrl+V</span> in Twitter to paste
        </div>
      )}
    </div>
  )
}

export default TwitterShare
