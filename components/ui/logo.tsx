import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  textSize?: string;
}

export default function Logo({
  size = 36,
  textSize = "text-xl",
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo.webp"
        alt="Sentinal AI"
        width={size}
        height={size}
        className="object-contain"
        priority
      />

      <span
        className={`font-bold tracking-tight text-white ${textSize}`}
      >
        Zenital AI
      </span>
    </Link>
  );
}