import React from "react";

import PortfolioGrid from "./PortfolioGrid";
import { ModelConfig } from "@/types";
import { headers } from "next/headers";

async function getConfig(): Promise<ModelConfig> {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/config`, { cache: "no-store", next: { tags: ['config'] } });
    if (!res.ok) throw new Error("Failed to load config");
    return res.json();
}

export default async function Portfolio() {
    const config = await getConfig();
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
