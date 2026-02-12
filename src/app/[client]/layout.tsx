import Sidebar from "@/components/Sidebar";
import { getClientConfig } from "@/lib/client-config";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ client: string }> }): Promise<Metadata> {
    const { client } = await params;
    const config = await getClientConfig(client);

    if (!config) return { title: 'Not Found' };

    return {
        title: {
            template: `%s | ${config.personalInfo.name}`,
            default: config.personalInfo.name,
        },
        description: config.personalInfo.bio,
        icons: {
            icon: '/favicon.ico',
        }
    };
}

export default async function ClientLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ client: string }>;
}) {
    const { client } = await params;
    const config = await getClientConfig(client);

    if (!config) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar config={config} />
            <main className="flex-1 md:ml-64 min-h-screen relative pt-16 md:pt-0">
                {children}
            </main>
        </div>
    );
}
