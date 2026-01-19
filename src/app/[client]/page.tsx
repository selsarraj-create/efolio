import Link from "next/link";
import Image from "next/image";
import { getClientConfig } from "@/lib/client-config";
import { notFound } from "next/navigation";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ClientHome({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  await cookies(); // Force dynamic rendering

  // Fetch fully merged client config
  const config = await getClientConfig(client);

  if (!config) {
    notFound();
  }

  const { images, personalInfo } = config;

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt={`${personalInfo.name} - Fashion Model`}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
        {/* Optional: Show Lead Code if it exists in config (requires custom field in logic) */}
        {/* For now keeping it simple to match main site design */}

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase text-center mb-8 drop-shadow-lg">
          {personalInfo.name}
        </h1>
        <Link
          href="/portfolio"
          className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base tracking-[0.2em] uppercase backdrop-blur-sm"
        >
          View Portfolio
        </Link>
      </div>
    </div>
  );
}
