"use client";

import React, { useState } from "react";
import LightboxBase from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface LightboxClientProps {
    slides: { src: string }[];
    index: number;
    close: () => void;
}

export default function LightboxClient({ slides, index, close }: LightboxClientProps) {
    return (
        <LightboxBase
            index={index}
            slides={slides}
            open={index >= 0}
            close={close}
        />
    );
}
