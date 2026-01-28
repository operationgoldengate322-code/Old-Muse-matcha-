import Link from "next/link";

import { requireOwner } from "@/lib/auth";

const ownerNav = [
  { href: "/owner", label: "Dashboard" },
  { href: "/owner/suppliers", label: "Suppliers" },
  { href: "/owner/pipeline", label: "Pipeline" },
  { href: "/owner/outreach", label: "Outreach" },
  { href: "/owner/research", label: "Research" },
  { href: "/owner/tasks", label: "Tasks" },
  { href: "/owner/settings", label: "Settings" },
];

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div>
            <p className="text-sm text-muted-foreground">Owner portal</p>
            <p className="text-lg font-semibold">Old Muse Matcha</p>
          </div>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            {ownerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
