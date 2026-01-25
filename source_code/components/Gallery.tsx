"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Gallery({ config }: { config: any }) {
    const { gallery, sections } = config;
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-65%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-stone-900">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                <div className="absolute top-10 left-10 md:top-20 md:left-20 z-10">
                    <h2 className="text-white font-cinzel text-4xl md:text-6xl">{sections.gallery.title}</h2>
                    <p className="text-white/60 mt-2 tracking-widest uppercase text-sm">{sections.gallery.subtitle}</p>
                </div>

                <motion.div style={{ x }} className="flex gap-4 p-4 md:gap-10 md:p-10">
                    {gallery.map((src: string, i: number) => (
                        <div
                            key={i}
                            className="group relative h-[60vh] w-[80vw] md:h-[70vh] md:w-[40vw] flex-shrink-0 bg-neutral-200 overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: "url(" + src + ")" }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
