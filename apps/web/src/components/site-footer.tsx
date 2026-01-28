import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Koyo Club</p>
          <p className="text-sm text-muted-foreground">
            Curated matcha drops paired with a sourcing hub for owners.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Explore</p>
          <div className="flex flex-col gap-1 text-muted-foreground">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/drops">Monthly drops</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Contact</p>
          <div className="flex flex-col gap-1 text-muted-foreground">
            <span>hello@koyoclub.com</span>
            <span>San Francisco, CA</span>
            <Link href="/owner">Owner portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
