"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "../lib/utils";

export function OurStory({ config }: { config: any }) {
    const { story, sections } = config;
    return (
        <section className="py-24 md:py-32 bg-[#FDFBF7] overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <span className="text-sm tracking-[0.3em] uppercase text-stone-500 block mb-4">{sections.story.subtitle}</span>
                    <h2 className="font-cinzel text-4xl md:text-5xl text-stone-800">{sections.story.title}</h2>
                </motion.div>

                <div className="relative">
                    {/* Vertical central line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-stone-300 -translate-x-1/2 md:translate-x-0" />

                    <div className="space-y-12 md:space-y-24">
                        {story.map((item: any, index: number) => (
                            <TimelineItem
                                key={index}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ item, index }: { item: any, index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={cn(
                "relative flex flex-col md:flex-row items-center",
                isEven ? "md:flex-row-reverse" : ""
            )}
        >
            {/* Spacer for proper alignment on Desktop */}
            <div className="flex-1 w-full md:w-auto" />

            {/* Central Circle Node */}
            <div className="z-10 absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#FDFBF7] border border-stone-300">
                <div className="w-3 h-3 rounded-full bg-[#D4A373]" />
            </div>

            {/* Content Card */}
            <div className={cn(
                "flex-1 w-full pl-16 md:pl-0 pt-1 md:pt-0",
                isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
            )}>
                <div className="space-y-4">
                    <span className="font-cinzel text-3xl text-[#D4A373]">{item.year}</span>
                    <h3 className="text-xl font-medium text-stone-800 uppercase tracking-widest">{item.title}</h3>
                    <p className="text-stone-600 leading-relaxed font-light">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
