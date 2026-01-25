"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Hero({ config }: { config: any }) {
    const { couple, event, sections } = config;
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(event.date) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [event.date]);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image / Placeholder if no image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop")', // Placeholder high-quality wedding image
                    filter: "brightness(0.6)"
                }}
            />

            <div className="relative z-10 text-center text-white px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <p className="text-xl md:text-2xl font-light tracking-[0.2em] mb-4 uppercase">
                        {event.city}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1 className="font-cinzel text-5xl md:text-8xl lg:text-9xl mb-8 leading-tight">
                        {couple.names.full}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12"
                >
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Minutes" />
                    <TimeUnit value={timeLeft.seconds} label="Seconds" />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
            >
                <span className="text-sm tracking-widest uppercase">{sections.hero.scrollIndicator}</span>
            </motion.div>
        </section>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-4xl md:text-6xl font-light font-cinzel">{value}</span>
            <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-white/80">{label}</span>
        </div>
    );
}
