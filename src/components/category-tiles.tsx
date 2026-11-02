import Image from "next/image";
import Link from "next/link";
import type { DocSummary } from "@/lib/types";
import { categories, storyCategory } from "@/lib/site";
import { ArrowUpRightIcon } from "./icons";

/**
 * Section grid: each tile shows the newest photograph from that section,
 * so the homepage reads as a magazine rather than a list.
 */
export function CategoryTiles({
  posts,
  storyCount,
  storyCover,
}: {
  posts: DocSummary[];
  storyCount: number;
  storyCover?: DocSummary;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => {
        const inSection = posts.filter((post) => post.category === category.slug);
        const cover = inSection.find((post) => post.image);
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group relative isolate flex min-h-[13rem] flex-col justify-end overflow-hidden rounded-xl border border-line p-5 card-lift"
          >
            {cover?.image ? (
              <>
                <Image
                  src={cover.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" aria-hidden />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(150deg, ${category.from}, ${category.to})` }}
                aria-hidden
              />
            )}

            <div className="relative text-white">
              <p className="kicker text-white/70">{category.shortName}</p>
              <h3 className="mt-1 font-serif text-xl font-semibold leading-tight">{category.name}</h3>
              <div className="mt-3 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.12em] text-white/60">
                <span>
                  {inSection.length} {inSection.length === 1 ? "article" : "articles"}
                </span>
                <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        );
      })}

      <Link
        href="/stories"
        className="group relative isolate flex min-h-[13rem] flex-col justify-end overflow-hidden rounded-xl border border-line p-5 card-lift"
      >
        {storyCover?.image ? (
          <>
            <Image
              src={storyCover.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" aria-hidden />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(150deg, ${storyCategory.from}, ${storyCategory.to})` }}
            aria-hidden
          />
        )}
        <div className="relative text-white">
          <p className="kicker text-[#e7c67e]">Fiction</p>
          <h3 className="mt-1 font-serif text-xl font-semibold leading-tight">Story Studio</h3>
          <div className="mt-3 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.12em] text-white/60">
            <span>{storyCount} stories</span>
            <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}
