import { cn, seed } from "@/lib/utils";
import { getCategory } from "@/lib/site";

type Props = {
  /** Category slug used for the palette. */
  category: string;
  /** Anything stable and unique — the slug works well. */
  seedKey: string;
  className?: string;
  /** Aspect ratio utility, e.g. "aspect-[16/10]". */
  ratio?: string;
  showLabel?: boolean;
  glyphClassName?: string;
};

/**
 * Generative, zero-payload cover art.
 * Keeps the site visually rich without shipping photographs (fast LCP,
 * no licensing headaches, no layout shift).
 */
export function CoverArt({
  category,
  seedKey,
  className,
  ratio = "aspect-[16/10]",
  showLabel = true,
  glyphClassName,
}: Props) {
  const cat = getCategory(category);
  const from = cat?.from ?? "#B94A24";
  const to = cat?.to ?? "#6B2A16";
  const r = seed(seedKey);
  const angle = 115 + Math.round(r * 90);
  const cx = 18 + Math.round(r * 60);
  const cy = 22 + Math.round((1 - r) * 56);
  const glyph = cat?.glyph ?? "✧";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[inherit] bg-paper-deep",
        ratio,
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`,
      }}
      aria-hidden
    >
      {/* soft light bloom */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle at ${cx}% ${cy}%, rgba(255,255,255,0.42), transparent 55%)`,
        }}
      />
      {/* concentric rings */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.22]"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <ellipse
            key={index}
            cx={cx * 2}
            cy={cy * 1.2}
            rx={18 + index * 16 + r * 20}
            ry={10 + index * 9 + r * 12}
            fill="none"
            stroke="white"
            strokeWidth="0.35"
          />
        ))}
        <path
          d={`M0 ${90 + r * 20} C 50 ${60 + r * 30}, 120 ${110 - r * 30}, 200 ${70 + r * 15}`}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
      {/* glyph */}
      <span
        className={cn(
          "absolute -bottom-6 -right-2 select-none font-serif leading-none text-white/25",
          glyphClassName ?? "text-[7rem]",
        )}
      >
        {glyph}
      </span>
      {showLabel && cat ? (
        <span className="absolute left-4 top-4 rounded-full bg-black/25 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
          {cat.name}
        </span>
      ) : null}
    </div>
  );
}
