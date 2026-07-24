import { useState, useEffect } from 'react'

interface TypingAnimationProps {
  text: string
  className?: string
  speed?: number
  idKey?: string // Forces restart when text changes
}

export function TypingAnimation({ text, className = '', speed = 30, idKey }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(intervalId)
      }
    }, speed)

    return () => clearInterval(intervalId)
  }, [text, idKey, speed])

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-primary animate-pulse" />
    </span>
  )
}
