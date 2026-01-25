"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import type { Event, ContentSettings } from "@/lib/types"

interface HeroProps {
  event: Event
  content: ContentSettings
}

export function Hero({ event, content }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (videoRef.current && event.hero_video_url) {
      videoRef.current.playbackRate = 0.5
    }
  }, [event.hero_video_url])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(event.date) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    const timer = setInterval(calculateTimeLeft, 1000)
    calculateTimeLeft()

    return () => clearInterval(timer)
  }, [event.date])

  const formatDate = () => {
    const date = new Date(event.date)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const backgroundImage = event.hero_image_url || "/romantic-wedding-venue-flowers-sunset.jpg"

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {event.hero_video_url ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover"
        >
          <source src={event.hero_video_url} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
          }}
        />
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl -mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 cursor-pointer"
        >
          <motion.img
            src="/images/default-wedding-hearts.png"
            alt="Hearts"
            className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain brightness-0 invert"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="cursor-default"
        >
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 md:mb-6 leading-tight tracking-wide text-white drop-shadow-2xl px-4"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {event.name}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-200/60 to-rose-200/60" />
          <svg className="w-3 h-3 md:w-4 md:h-4 text-rose-200/80" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent via-rose-200/60 to-rose-200/60" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-6"
        >
          <p className="text-base md:text-xl font-light tracking-[0.25em] uppercase text-white font-serif">
            {formatDate()}
          </p>
          <p className="text-sm md:text-lg font-light tracking-[0.2em] uppercase text-white/90 mt-2 font-serif">
            {event.city}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="space-y-4 md:space-y-5"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 md:w-12 h-[1px] bg-white/40" />
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-white font-serif">
              Until We Get Married
            </p>
            <div className="w-8 md:w-12 h-[1px] bg-white/40" />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 md:gap-12">
            <TimeUnit value={timeLeft.days} label="DAYS" />
            <TimeUnit value={timeLeft.hours} label="HOURS" />
            <TimeUnit value={timeLeft.minutes} label="MINUTES" />
            <TimeUnit value={timeLeft.seconds} label="SECONDS" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 12, 0] }}
        transition={{ delay: 2, duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-white text-center z-20"
      >
        <div className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
          <span className="text-xs tracking-[0.3em] uppercase block mb-3 font-serif">{content.scroll_indicator}</span>
          <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tabular-nums text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {value.toString().padStart(2, "0")}
        </motion.span>
      </div>
      <div className="mt-2 md:mt-3 pt-1 md:pt-2 border-t border-rose-200/30 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[100px]">
        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-rose-100/70 font-serif">
          {label}
        </span>
      </div>
    </div>
  )
}
