'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createNoise3D } from 'simplex-noise'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import chroma from 'chroma-js'
import { useRouter } from 'next/navigation'

// Constants for fluid background
const GRID_WIDTH = 12
const GRID_HEIGHT = 8
const MAX_DISPLACEMENT = 40
const NOISE_SCALE = 0.003
const SPEED = 0.0005

const BASE_COLOR = '#000000'
const MID_COLOR = '#404040'
const HIGHLIGHT_COLOR = '#808080'
const COLOR_SCALE = chroma.scale([BASE_COLOR, MID_COLOR, HIGHLIGHT_COLOR])
const BACKGROUND_COLOR = chroma.mix(BASE_COLOR, MID_COLOR, 0.3).hex()
const FORM_BACKGROUND_COLOR = 'rgba(32, 32, 32, 0.8)' // Semi-transparent dark gray

interface Point {
  x: number
  y: number
  originalX: number
  originalY: number
  displacement: number
}

export function Contact(): JSX.Element {
  const router = useRouter()
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const pointsRef = useRef<Point[]>([])
  const noiseRef = useRef<(x: number, y: number, z: number) => number>()
  const timeRef = useRef(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleNavigation = (view: string) => {
    if (view.toLowerCase() === 'home') {
      router.push('/')
    } else {
      router.push(`/${view.toLowerCase()}`)
    }
  };

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

      if (svg) {
        const g = svg.querySelector('g')
        if (g) {
          g.innerHTML = generatePathData(pointsRef.current)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearTimeout(timer);
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
            return COLOR_SCALE(0.3 + avgDisplacement * 0.7).hex()
          }
          return COLOR_SCALE(avgDisplacement).hex()
        }

        const avgDisplacement = (points[i].displacement + points[i + 1].displacement + points[i + GRID_WIDTH + 1].displacement) / 3
        const color = getColor(avgDisplacement)
        
        pathData += `<path d="M${points[i].x},${points[i].y} L${points[i + 1].x},${points[i + 1].y} L${points[i + GRID_WIDTH + 1].x},${points[i + GRID_WIDTH + 1].y} Z" fill="${color}" stroke="none" />`
        
        const avgDisplacement2 = (points[i + 1].displacement + points[i + GRID_WIDTH + 2].displacement + points[i + GRID_WIDTH + 1].displacement) / 3
        const color2 = getColor(avgDisplacement2)
        
        pathData += `<path d="M${points[i + 1].x},${points[i + 1].y} L${points[i + GRID_WIDTH + 2].x},${points[i + GRID_WIDTH + 2].y} L${points[i + GRID_WIDTH + 1].x},${points[i + GRID_WIDTH + 1].y} Z" fill="${color2}" stroke="none" />`
      }
    }
    return pathData
  }

  const inputClasses = `
    bg-[#303030] 
    border-transparent 
    text-white 
    placeholder-gray-500 
    focus:outline-none 
    focus:ring-0 
    focus:shadow-none 
    transition-all 
    duration-300 
    ease-in-out 
    bg-[length:0%_2px,0%_2px,0%_2px,0%_2px] 
    bg-[position:0%_100%,100%_100%,100%_0%,0%_0%] 
    bg-no-repeat 
    bg-[linear-gradient(to_right,white,white),linear-gradient(to_left,white,white),linear-gradient(to_bottom,white,white),linear-gradient(to_top,white,white)] 
    focus:animate-trace-border 
    focus:bg-[length:100%_2px,100%_2px,100%_2px,100%_2px]
    !outline-none 
    !ring-0 
    !shadow-none
  `

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: BACKGROUND_COLOR }}>
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g dangerouslySetInnerHTML={{ __html: generatePathData(pointsRef.current) }} />
      </svg>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <h1 className="text-5xl font-bold mb-8 text-white" style={{ 
          textShadow: '3px 3px 0px rgba(0, 0, 0, 0.7), 1px 1px 0px rgba(0, 0, 0, 0.5)' 
        }}>
          magnify.ai
        </h1>
        <nav className="mb-12">
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
        <div className="bg-[rgba(32,32,32,0.8)] p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact form */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-300">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-300">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Enter your message" 
                    className={`min-h-[120px] ${inputClasses}`}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200 transition-colors duration-300"
                >
                  Send Message
                </Button>
              </form>
            </div>
            {/* FAQ section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">FAQ</h3>
              <div className="space-y-4">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-white">
                    <h4 className="text-lg font-medium">What services do you offer?</h4>
                    <ChevronDownIcon className="h-5 w-5 transition-transform [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="text-gray-300">
                      We offer a wide range of services including web design, web development, digital marketing, and more.
                      Our team of experts can help you with any of your digital needs.
                    </p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-white">
                    <h4 className="text-lg font-medium">How much do your services cost?</h4>
                    <ChevronDownIcon className="h-5 w-5 transition-transform [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="text-gray-300">
                      The cost of our services varies depending on the scope of the project and the specific services
                      required. We offer competitive rates and are happy to provide a custom quote based on your needs.
                    </p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-white">
                    <h4 className="text-lg font-medium">How long does a project typically take?</h4>
                    <ChevronDownIcon className="h-5 w-5 transition-transform [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="text-gray-300">
                      The timeline for a project can vary depending on the scope and complexity of the work. We work closely
                      with our clients to develop a project timeline that meets their needs and expectations.
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {}

function ChevronDownIcon({ className, ...props }: ChevronDownIconProps): JSX.Element {
  return (
    <svg
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
