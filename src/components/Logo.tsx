import Link from "next/link";
import { BadgeMark } from "./Badge";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display flex flex-col leading-[0.82] ${className}`}>
      <span className="text-[0.78em] tracking-wide text-foam">Noah&apos;s</span>{" "}
      <span className="text-blue-glow">Detailing</span>
    </span>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5 rounded-md">
      <BadgeMark className="h-10 w-auto drop-shadow-[0_4px_14px_rgba(46,107,255,0.45)]" />
      <Wordmark className="text-[1.35rem]" />
      <span className="sr-only">(home)</span>
    </Link>
  );
}
