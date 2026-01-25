"use client"

import { motion } from "framer-motion"
import type { StoryMilestone, ContentSettings } from "@/lib/types"

interface OurStoryProps {
  story: StoryMilestone[]
  content: ContentSettings
}

export function OurStory({ story, content }: OurStoryProps) {
  return (
    <section className="py-24 md:py-32 bg-[#FDFBF7] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-stone-500 block mb-4">{content.story_subtitle}</span>
          <motion.h2
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl text-stone-800 mb-6 relative inline-block cursor-default"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            {content.story_title}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent"
            />
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-stone-600 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-16 md:mb-24 italic"
        >
          Moments that we want to share with everyone who are important to us
        </motion.p>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-300 -translate-x-1/2" />
          <div className="md:hidden absolute left-[20px] top-0 bottom-0 w-[1px] bg-stone-300" />

          <div className="space-y-12 md:space-y-24">
            {story.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} isLeft={index % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item, index, isLeft }: { item: StoryMilestone; index: number; isLeft: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="z-10 absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#FDFBF7] border-2 border-stone-300 shadow-sm"
      >
        <div className="w-3 h-3 rounded-full bg-[#D4A373]" />
      </motion.div>

      <div
        className={`pl-16 md:pl-0 pt-1 md:pt-0 ${
          isLeft ? "md:pr-[calc(50%+3rem)] md:text-right" : "md:pl-[calc(50%+3rem)] md:text-left"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.02, x: isLeft ? -5 : 5 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 cursor-default"
        >
          <span className="font-serif text-4xl md:text-5xl text-[#D4A373] block">{item.year}</span>
          <h3 className="text-2xl md:text-3xl text-stone-800" style={{ fontFamily: "Great Vibes, cursive" }}>
            {item.title}
          </h3>
          <p className="text-stone-600 leading-relaxed font-light max-w-md italic">{item.description}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
