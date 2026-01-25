"use client";

import { motion } from "framer-motion";

export function EventDetails({ config }: { config: any }) {
    const { event, sections } = config;
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-16 md:gap-8">
                    {/* Ceremony */}
                    <EventCard
                        title={sections.event.ceremonyTitle}
                        event={event.ceremony}
                        delay={0}
                    />

                    {/* Party */}
                    <EventCard
                        title={sections.event.partyTitle}
                        event={event.party}
                        delay={0.2}
                    />
                </div>
            </div>
        </section>
    );
}

function EventCard({ title, event, delay }: { title: string, event: any, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            className="flex flex-col items-center text-center group"
        >
            <h3 className="font-cinzel text-3xl mb-2 text-stone-800">{title}</h3>
            <div className="w-12 h-[1px] bg-[#D4A373] mb-6" />

            <p className="text-stone-600 font-medium mb-1 uppercase tracking-wide">{event.name}</p>
            <p className="text-stone-500 mb-6 px-10">{event.location}</p>
            <p className="font-cinzel text-xl text-stone-900 mb-8">{event.time}</p>

            <div className="w-full aspect-square md:aspect-video bg-stone-100 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                <iframe
                    src={event.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                />
            </div>
        </motion.div>
    )
}
