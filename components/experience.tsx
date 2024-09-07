/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/z7cnx2xW6tF
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { IBM_Plex_Sans } from 'next/font/google'
import { Comfortaa } from 'next/font/google'

ibm_plex_sans({
  subsets: ['latin'],
  display: 'swap',
})

comfortaa({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link"

export function Experience() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#1e1e1e] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <canvas id="background-canvas" className="w-full h-full" />
      </div>
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-sans mb-8 text-center">
          Experience
        </div>
        <nav className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gray-400 transition-colors duration-300" prefetch={false}>
              Home
            </Link>
            <Link href="/experience" className="text-white hover:text-gray-400 transition-colors duration-300" prefetch={false}>
              Experience
            </Link>
            <Link href="#" className="text-white hover:text-gray-400 transition-colors duration-300" prefetch={false}>
              Services
            </Link>
            <Link href="#" className="text-white hover:text-gray-400 transition-colors duration-300" prefetch={false}>
              Blog
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-400 transition-colors duration-300" prefetch={false}>
              Contact
            </Link>
          </div>
        </nav>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=400)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Innovative Solutions</h3>
                <p className="text-gray-400 text-base">
                  Discover our cutting-edge technologies that transform industries.
                </p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full col-span-2">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=600)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Unparalleled Expertise</h3>
                <p className="text-gray-400 text-base">
                  Our team of experts delivers tailored solutions for your business.
                </p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=400)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Transformative Impact</h3>
                <p className="text-gray-400 text-base">Our solutions drive measurable results and lasting change.</p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full row-span-2">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=600&width=400)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Collaborative Approach</h3>
                <p className="text-gray-400 text-base">We work closely with our clients to ensure their success.</p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=400)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Proven Track Record</h3>
                <p className="text-gray-400 text-base">
                  Our solutions have a history of delivering outstanding results.
                </p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full col-span-2">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=600)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Innovative Thinking</h3>
                <p className="text-gray-400 text-base">Our team is always pushing the boundaries of what's possible.</p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=400)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Cutting-Edge Technology</h3>
                <p className="text-gray-400 text-base">Our solutions leverage the latest advancements in technology.</p>
              </div>
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url(/placeholder.svg?height=300&width=400)" }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">Scalable Solutions</h3>
                <p className="text-gray-400 text-base">Our solutions are designed to grow with your business.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
