"use client";

import React, { useState } from "react";
import { ModelConfig } from "@/types";

export default function ContactForm({ personalInfo, clientSlug }: { personalInfo: ModelConfig['personalInfo'], clientSlug?: string }) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
            clientSlug: clientSlug || 'main',
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus("success");
                form.reset();
            } else {
                const errorData = await response.json();
                console.error("Submission failed:", errorData);
                alert(`Error: ${errorData.error || "Unknown error"}`);
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col justify-center">
            <div className="w-full max-w-2xl mx-auto p-8 md:p-12">
                <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase mb-4 text-center">
                    Contact
                </h1>
                <p className="text-center text-neutral-500 dark:text-neutral-400 mb-12 mb:mb-16 tracking-wide">
                    For bookings and inquiries, please get in touch.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full border-b border-neutral-300 dark:border-neutral-700 bg-transparent py-2 focus:outline-none focus:border-gold-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full border-b border-neutral-300 dark:border-neutral-700 bg-transparent py-2 focus:outline-none focus:border-gold-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            required
                            className="w-full border-b border-neutral-300 dark:border-neutral-700 bg-transparent py-2 focus:outline-none focus:border-gold-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            required
                            className="w-full border-b border-neutral-300 dark:border-neutral-700 bg-transparent py-2 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="text-center pt-8">
                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-10 py-3 uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {status === "submitting" ? "Sending..." : "Send Message"}
                        </button>
                    </div>

                    {status === "success" && (
                        <p className="text-green-600 text-center text-sm mt-4 tracking-wide">
                            Message sent successfully! We'll get back to you soon.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-red-600 text-center text-sm mt-4 tracking-wide">
                            Something went wrong. Please try again later.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
