"use client";

import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  active: boolean;
  icon: ReactNode;
  label: string;
};

function NavLink({ href, active, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isSearch = pathname === "/";
  const isFavorites = pathname.startsWith("/favorites");

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight hover:underline">
          {config.app.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4">
          <ThemeToggle />
          <NavLink
            href="/"
            active={isSearch}
            icon={<Search className="size-4" aria-hidden="true" />}
            label="Search"
          />
          <NavLink
            href="/favorites"
            active={isFavorites}
            icon={<Heart className="size-4" aria-hidden="true" />}
            label="Favorites"
          />
        </nav>
      </div>
    </header>
  );
}
