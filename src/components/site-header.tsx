"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, siteConfig, storyCategory } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme";

const navItems = [
  ...categories.filter((category) => category.nav).map((category) => ({
    label: category.shortName,
    href: `/category/${category.slug}`,
  })),
  { label: "Stories", href: "/stories" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if (event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 z-50 border-b border-line backdrop-blur-xl"
        style={{ backgroundColor: "var(--header-bg)" }}
      >
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex items-baseline gap-1.5" aria-label={`${siteConfig.name} home`}>
            <span className="font-serif text-[1.35rem] font-semibold tracking-[-0.03em] text-ink">
              Sage
            </span>
            <span className="font-serif text-[1.35rem] font-semibold text-accent">&amp;</span>
            <span className="font-serif text-[1.35rem] font-semibold tracking-[-0.03em] text-ink">
              Story
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[0.82rem] font-medium transition-colors",
                    active ? "text-accent" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" aria-hidden />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
              aria-label="Search articles"
            >
              <SearchIcon className="size-3.5" />
              <span>Search</span>
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-sans text-[0.6rem] text-faint">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink sm:hidden"
              aria-label="Search articles"
            >
              <SearchIcon className="size-[18px]" />
            </button>

            <ThemeToggle />

            <Link
              href="/newsletter"
              className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-opacity hover:opacity-85 md:inline-flex"
            >
              Subscribe
              <ArrowUpRightIcon className="size-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid size-9 place-items-center rounded-full border border-line text-ink-soft lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>

        {/* secondary category rail — desktop only */}
        <div className="hidden border-t border-line/70 lg:block">
          <div className="shell flex h-9 items-center justify-between text-[0.72rem] text-muted">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
              <span className="kicker text-faint">Sections</span>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="whitespace-nowrap transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              ))}
              <Link href="/stories" className="whitespace-nowrap text-gold transition-opacity hover:opacity-80">
                {storyCategory.name}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="whitespace-nowrap transition-colors hover:text-accent">
                All articles
              </Link>
              <Link href="/archive" className="whitespace-nowrap transition-colors hover:text-accent">
                Archive
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-paper transition-[opacity,transform] duration-300 lg:hidden",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav className="shell flex flex-col py-4" aria-label="Mobile">
          <Link
            href="/"
            className="border-b border-line py-3.5 font-serif text-lg text-ink"
            tabIndex={open ? 0 : -1}
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex items-center justify-between border-b border-line py-3.5"
              tabIndex={open ? 0 : -1}
            >
              <span className="font-serif text-lg text-ink">{category.name}</span>
              <span className="text-sm text-faint" aria-hidden>
                {category.glyph}
              </span>
            </Link>
          ))}
          <Link
            href="/stories"
            className="border-b border-line py-3.5 font-serif text-lg text-gold"
            tabIndex={open ? 0 : -1}
          >
            Story Studio
          </Link>
          <Link
            href="/blog"
            className="border-b border-line py-3.5 text-sm text-muted"
            tabIndex={open ? 0 : -1}
          >
            All articles
          </Link>
          <Link
            href="/archive"
            className="border-b border-line py-3.5 text-sm text-muted"
            tabIndex={open ? 0 : -1}
          >
            Archive
          </Link>
          <Link
            href="/about"
            className="border-b border-line py-3.5 text-sm text-muted"
            tabIndex={open ? 0 : -1}
          >
            About &amp; editorial policy
          </Link>
          <Link
            href="/newsletter"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper"
            tabIndex={open ? 0 : -1}
          >
            Subscribe to the letter
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
