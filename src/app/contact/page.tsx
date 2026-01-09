

import React from "react";
import ContactForm from "./ContactForm";
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

export default async function Contact() {
    const config = await getConfig();
    // The original code had client-side logic directly in this server component.
    // It has been refactored into a separate client component `ContactForm`.
    // The `personalInfo` prop is passed to the client component.
    const { personalInfo } = config;
    return <ContactForm personalInfo={personalInfo} />;
}


