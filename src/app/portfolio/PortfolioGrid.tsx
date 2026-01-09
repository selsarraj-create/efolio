"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PortfolioGridProps {
    images: string[];
}

export default function PortfolioGrid({ images }: PortfolioGridProps) {
    const [index, setIndex] = useState(-1);
    const slides = images.map((src) => ({ src }));

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className="relative aspect-[3/4] cursor-pointer group overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                        onClick={() => setIndex(i)}
                    >
                        <Image
                            src={src}
                            alt={`Portfolio image ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                ))}
            </div>

            <Lightbox
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
            />
        </>
    );
}
