/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react'

export default function BackgroundRotator({ height = 360 }: { height?: number }) {
  // Eagerly import all images in the backgrounds folder
  // Supported extensions: png, jpg, jpeg, webp
  const modules = import.meta.glob<{ default: string }>('./assets/**/*.{png,jpg,jpeg,webp,svg}', { eager: true })
  const images: string[] = Object.values(modules).map((m: any) => m.default)

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length === 0) return
    setIndex(Math.floor(Math.random() * images.length))
  }, [images.length])

  useEffect(() => {
    if (images.length === 0) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [images.length])

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: `${height}px`,
    maxHeight: '70vh',
    minHeight: '180px',
    position: 'relative',
  }

  return (
    <div className="rotator" style={containerStyle}>
      {images.length > 0 ? (
        images.map((src, i) => (
          <img
            key={i}
            src={src}
            className={`rotator-slide ${i === index ? 'active' : ''}`}
            alt={`background-${i}`}
          />
        ))
      ) : null}
    </div>
  )
}
