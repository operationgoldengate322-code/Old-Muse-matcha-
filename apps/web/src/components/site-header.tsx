import Link from "next/link";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/drops", label: "Monthly Drops" },
  { href: "/plans", label: "Plans" },
  { href: "/learn", label: "Learn" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Old Muse Matcha
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/account">Account</Link>
          </Button>
          <Button asChild>
            <Link href="/plans">Subscribe</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
