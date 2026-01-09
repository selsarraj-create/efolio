import Image from "next/image";
import Link from "next/link";
import modelConfig from "@/data/model-config.json";

export default function Home() {
  const { images, personalInfo } = modelConfig;

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
