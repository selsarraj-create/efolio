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
            <div className="masonry-grid">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className="masonry-item cursor-pointer"
                        style={{ animationDelay: `${i * 60}ms` }}
                        onClick={() => setIndex(i)}
                    >
                        <Image
                            src={src}
                            alt={`Portfolio image ${i + 1}`}
                            width={800}
                            height={1000}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="masonry-overlay" />
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
