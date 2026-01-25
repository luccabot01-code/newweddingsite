"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

import { cn } from "../lib/utils";
import { submitRSVP } from "../app/actions";

// const submitRSVP = async (slug: string, data: any) => {
//     // Mock for static export
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     console.log("Static submission:", data);
//     return { success: true };
// };

export function Rsvp({ config, slug }: { config: any, slug: string }) {
    const { sections, event } = config;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fadingOut, setFadingOut] = useState(false); // Added fadingOut state

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        await submitRSVP(slug, data);
        setFadingOut(true);
        setIsSubmitting(false);
        setIsSubmitted(true);
    }

    return (
        <section className="py-32 bg-[#F5F5F0] relative overflow-hidden" id="rsvp">
            <div className="container mx-auto px-4 max-w-2xl relative z-10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white p-8 md:p-16 shadow-2xl text-center border-t-4 border-[#D4A373]"
                >
                    <span className="text-sm tracking-[0.3em] uppercase text-stone-500 block mb-3">{sections.rsvp.subtitle}</span>
                    <h2 className="font-cinzel text-5xl md:text-6xl text-stone-900 mb-8">{sections.rsvp.title}</h2>
                    <p className="text-stone-600 mb-10 font-light">
                        Please respond by {event.rsvpDeadline}.
                    </p>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-12"
                        >
                            <div className="text-5xl mb-4">✨</div>
                            <h3 className="font-cinzel text-2xl text-stone-800 mb-2">{sections.rsvp.thankYouMessage}</h3>
                            <p className="text-stone-600">{sections.rsvp.thankYouSubmessage}</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs uppercase tracking-widest text-stone-500">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    id="name"
                                    className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs uppercase tracking-widest text-stone-500">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-xs uppercase tracking-widest text-stone-500">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="guests" className="text-xs uppercase tracking-widest text-stone-500">Guests</label>
                                    <select
                                        id="guests"
                                        className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                                    >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="attending" className="text-xs uppercase tracking-widest text-stone-500">Attending</label>
                                    <select
                                        id="attending"
                                        className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                                    >
                                        <option value="yes">Joyfully Accepts</option>
                                        <option value="no">Regretfully Declines</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs uppercase tracking-widest text-stone-500">Message (Optional)</label>
                                <textarea
                                    id="message"
                                    rows={3}
                                    className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors resize-none"
                                    placeholder="We are so happy for you!"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={cn(
                                    "w-full bg-[#333] text-white py-4 px-8 uppercase tracking-[0.2em] text-sm hover:bg-[#D4A373] transition-colors duration-500",
                                    isSubmitting && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? "Sending..." : sections.rsvp.buttonText}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
