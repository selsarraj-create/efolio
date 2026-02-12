import Link from "next/link";
import Image from "next/image";
import { getModelConfig } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const config = await getModelConfig();
  const { images, personalInfo } = config;
  const isPortrait = config.heroOrientation === 'portrait';

  // Portrait: split-screen on desktop
  if (isPortrait) {
    return (
      <div className="relative w-full h-screen">
        {/* Mobile: full-screen hero */}
        <div className="md:hidden absolute inset-0 bg-black">
          <Image
            src={images.hero}
            alt={`${personalInfo.name} - Fashion Model`}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-5xl tracking-widest uppercase text-center mb-8 drop-shadow-lg">
              {personalInfo.name}
            </h1>
            <Link
              href="/portfolio"
              className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-[0.2em] uppercase backdrop-blur-sm"
            >
              View Portfolio
            </Link>
          </div>
        </div>

        {/* Desktop: split-screen, covers full viewport over sidebar */}
        <div className="hidden md:flex fixed inset-0 z-50 h-screen">
          <div className="w-1/2 bg-neutral-950 flex flex-col items-center justify-center px-12">
            <h1 className="font-serif text-6xl lg:text-8xl tracking-widest uppercase text-white text-center mb-10 leading-tight">
              {personalInfo.name}
            </h1>
            {personalInfo.bio && (
              <p className="text-neutral-400 text-sm tracking-wide max-w-md text-center mb-10 leading-relaxed">
                {personalInfo.bio}
              </p>
            )}
            <Link
              href="/portfolio"
              className="px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-[0.2em] uppercase"
            >
              View Portfolio
            </Link>
          </div>
          <div className="w-1/2 relative">
            <Image
              src={images.hero}
              alt={`${personalInfo.name} - Fashion Model`}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  // Landscape (or unset): full-bleed hero
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black">
        <Image
          src={images.hero}
          alt={`${personalInfo.name} - Fashion Model`}
          fill
          className="object-cover md:object-contain object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
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
