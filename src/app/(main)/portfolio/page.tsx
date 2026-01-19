import React from "react";
import PortfolioGrid from "./PortfolioGrid";
import { getModelConfig } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function Portfolio() {
    const config = await getModelConfig();
    const { images } = config;

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="p-4 md:p-8 lg:p-12">
                <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase mb-12 text-center md:text-left">
                    Portfolio
                </h1>
                <PortfolioGrid images={images.portfolio} />
            </div>
        </div>
    );
}
