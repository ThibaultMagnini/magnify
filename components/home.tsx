'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createNoise3D } from 'simplex-noise'
import chroma from 'chroma-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const GRID_WIDTH = 12  // Increased for better triangle distribution
const GRID_HEIGHT = 8  // Increased for better triangle distribution
const MAX_DISPLACEMENT = 40 // Maximum displacement from original position
const NOISE_SCALE = 0.003 // Scale of the noise (adjust for more/less fluidity)
const SPEED = 0.0005 // Speed of the animation (adjust as needed)

// Update these constants for color control
const BASE_COLOR = '#000000'  // Black
const MID_COLOR = '#404040'   // Dark gray
const HIGHLIGHT_COLOR = '#808080'  // Medium gray
const COLOR_SCALE = chroma.scale([BASE_COLOR, MID_COLOR, HIGHLIGHT_COLOR])

const BACKGROUND_COLOR = chroma.mix(BASE_COLOR, MID_COLOR, 0.3).hex()

interface Point {
  x: number
  y: number
  originalX: number
  originalY: number
  displacement: number  // Add this to track displacement
}

interface FluidBackgroundProps {
  onNavigate: (view: string) => void;
}

export function FluidBackground() {
  const router = useRouter()
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const pointsRef = useRef<Point[]>([])
  const noiseRef = useRef<(x: number, y: number, z: number) => number>()
  const timeRef = useRef(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth
    const height = svg.clientHeight

    noiseRef.current = createNoise3D()

    const generatePoints = () => {
      const points: Point[] = []
      for (let y = 0; y <= GRID_HEIGHT; y++) {
        for (let x = 0; x <= GRID_WIDTH; x++) {
          const originalX = (x / GRID_WIDTH) * width
          const originalY = (y / GRID_HEIGHT) * height
          points.push({
            x: originalX,
            y: originalY,
            originalX,
            originalY,
            displacement: 0,
          })
        }
      }
      return points
    }

    pointsRef.current = generatePoints()

    const animate = () => {
      timeRef.current += SPEED

      pointsRef.current.forEach((point, index) => {
        const isEdgePoint = 
          index % (GRID_WIDTH + 1) === 0 || // Left edge
          index % (GRID_WIDTH + 1) === GRID_WIDTH || // Right edge
          index < GRID_WIDTH + 1 || // Top edge
          index >= pointsRef.current.length - (GRID_WIDTH + 1) // Bottom edge

        if (!isEdgePoint) {
          const noiseX = noiseRef.current!(point.originalX * NOISE_SCALE, point.originalY * NOISE_SCALE, timeRef.current)
          const noiseY = noiseRef.current!(point.originalY * NOISE_SCALE, point.originalX * NOISE_SCALE, timeRef.current + 1000)

          point.x = point.originalX + noiseX * MAX_DISPLACEMENT
          point.y = point.originalY + noiseY * MAX_DISPLACEMENT
          point.displacement = Math.sqrt(noiseX * noiseX + noiseY * noiseY)
        } else {
          point.displacement = 0
        }
      })

      // Update the SVG content
      const svg = svgRef.current
      if (svg) {
        const g = svg.querySelector('g')
        if (g) {
          g.innerHTML = generatePathData(pointsRef.current)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      // Set loaded to true after a short delay
      const timer = setTimeout(() => setIsLoaded(true), 100);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        clearTimeout(timer);
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const generatePathData = (points: Point[]) => {
    let pathData = ''
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const i = y * (GRID_WIDTH + 1) + x
        if (i + GRID_WIDTH + 2 >= points.length) continue;

        const isEdge = y === 0 || y === GRID_HEIGHT - 1 || x === 0 || x === GRID_WIDTH - 1

        const getColor = (avgDisplacement: number) => {
          if (isEdge) {
            // Use a lighter color for edge triangles
            return COLOR_SCALE(0.3 + avgDisplacement * 0.7).hex()
          }
          return COLOR_SCALE(avgDisplacement).hex()
        }

        const avgDisplacement = (points[i].displacement + points[i + 1].displacement + points[i + GRID_WIDTH + 1].displacement) / 3
        const color = getColor(avgDisplacement)
        
        // First triangle
        pathData += `<path d="M${points[i].x},${points[i].y} `
        pathData += `L${points[i + 1].x},${points[i + 1].y} `
        pathData += `L${points[i + GRID_WIDTH + 1].x},${points[i + GRID_WIDTH + 1].y} Z" `
        pathData += `fill="${color}" stroke="none" />`
        
        // Second triangle
        const avgDisplacement2 = (points[i + 1].displacement + points[i + GRID_WIDTH + 2].displacement + points[i + GRID_WIDTH + 1].displacement) / 3
        const color2 = getColor(avgDisplacement2)
        
        pathData += `<path d="M${points[i + 1].x},${points[i + 1].y} `
        pathData += `L${points[i + GRID_WIDTH + 2].x},${points[i + GRID_WIDTH + 2].y} `
        pathData += `L${points[i + GRID_WIDTH + 1].x},${points[i + GRID_WIDTH + 1].y} Z" `
        pathData += `fill="${color2}" stroke="none" />`
      }
    }
    return pathData
  }

  const handleNavigation = (view: string) => {
    if (view.toLowerCase() === 'home') {
      router.push('/')
    } else {
      router.push(`/${view.toLowerCase()}`)
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: BACKGROUND_COLOR }}>
      <svg
        ref={svgRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g dangerouslySetInnerHTML={{ __html: generatePathData(pointsRef.current) }} />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-20 text-center">
          <h1 className="text-7xl font-bold mb-8 text-white" style={{ 
            textShadow: '3px 3px 0px rgba(0, 0, 0, 0.7), 1px 1px 0px rgba(0, 0, 0, 0.5)' 
          }}>
            magnify.ai
          </h1>
          <nav>
            <ul className="flex flex-wrap justify-center space-x-6 text-lg">
              {['Home', 'Experience', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item)
                    }}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}