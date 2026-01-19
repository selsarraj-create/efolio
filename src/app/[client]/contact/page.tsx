import React from "react";
import ContactForm from "@/app/(main)/contact/ContactForm";
import { getClientConfig } from "@/lib/client-config";
import { notFound } from "next/navigation";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ClientContact({ params }: { params: Promise<{ client: string }> }) {
    const { client } = await params;
    await cookies();

    const config = await getClientConfig(client);

    if (!config) {
        notFound();
    }

    return <ContactForm personalInfo={config.personalInfo} clientSlug={client} />;
}
