import React from "react";
import ContactForm from "./ContactForm";
import { getModelConfig } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function Contact() {
    const config = await getModelConfig();
    // The original code had client-side logic directly in this server component.
    // It has been refactored into a separate client component `ContactForm`.
    // The `personalInfo` prop is passed to the client component.
    const { personalInfo } = config;
    return <ContactForm personalInfo={personalInfo} clientSlug="main" />;
}


