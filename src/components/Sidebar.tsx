"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModelConfig } from "@/types";

interface SidebarProps {
    config: ModelConfig;
}

export default function Sidebar({ config }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { personalInfo, stats, images } = config;

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-neutral-900 z-50 px-6 py-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-serif text-xl tracking-widest uppercase">{personalInfo.name}</span>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                    <div className="w-6 h-0.5 bg-current mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-current mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-current"></div>
                </button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col overflow-y-auto">
                    {/* Profile Image */}
                    <div className="relative aspect-square w-full">
                        <Image
                            src={images.profile}
                            alt={personalInfo.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow">
                        <h1 className="font-serif text-2xl tracking-widest uppercase mb-8 text-center md:text-left">
                            {personalInfo.name}
                        </h1>

                        {/* Navigation */}
                        <nav className="mb-12">
                            <ul className="space-y-4">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`text-sm tracking-widest uppercase transition-colors hover:text-gold-500 ${pathname === item.href
                                                ? "text-gold-500 font-medium"
                                                : "text-neutral-500 dark:text-neutral-400"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                                {/* Admin Link (Hidden/ Subtle) */}
                                <li>
                                    <Link href="/admin" className="text-[10px] text-neutral-300 uppercase hover:text-neutral-500 mt-4 block">
                                        Admin
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Stats */}
                        <div className="mt-auto">
                            {/* <h2 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-50">Measurements</h2> */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                <div>Height</div>
                                <div className="text-right text-neutral-900 dark:text-white">{stats.height}</div>
                                <div>Bust</div>
                                <div className="text-right text-neutral-900 dark:text-white">{stats.bust}</div>
                                <div>Waist</div>
                                <div className="text-right text-neutral-900 dark:text-white">{stats.waist}</div>
                                <div>Hips</div>
                                <div className="text-right text-neutral-900 dark:text-white">{stats.hips}</div>
                                <div className="mt-2">Shoes</div>
                                <div className="mt-2 text-right text-neutral-900 dark:text-white">{stats.shoes}</div>
                                <div>Eyes</div>
                                <div className="text-right text-neutral-900 dark:text-white">{stats.eyes}</div>
                                <div>Hair</div>
                                <div className="text-right text-neutral-900 dark:text-white">{stats.hair}</div>
                            </div>
                        </div>

                        <div className="mt-8 text-[10px] text-neutral-400 text-center md:text-left">
                            &copy; {personalInfo.copyrightYear} {personalInfo.name}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
