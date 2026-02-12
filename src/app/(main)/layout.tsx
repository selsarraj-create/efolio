import Sidebar from "@/components/Sidebar";
import { getModelConfig } from "@/lib/config";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const config = await getModelConfig();

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar config={config} />
            <main className="flex-1 md:ml-64 min-h-screen relative pt-16 md:pt-0">
                {children}
            </main>
        </div>
    );
}
