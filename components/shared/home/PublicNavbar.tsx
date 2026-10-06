import Link from "next/link";
import { Menu, HeartPulse } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function PublicNavbar() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Consultations", href: "/consultation" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "Health Plans", href: "/health-plans" },
    { name: "Medicines", href: "/medicine" },
    { name: "NGOs", href: "/ngos" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-primary" />

          <span className="hidden text-xl font-bold text-primary sm:inline-block">
            Healthcare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href="/login"
            className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground sm:hidden"
          >
            Log in
          </Link>

          <Sheet>
            <SheetTrigger className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetTitle className="mb-6 flex items-center gap-2 text-left text-xl font-bold text-primary">
                <HeartPulse className="h-6 w-6" />
                PH Health
              </SheetTitle>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-2 py-1 text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  <Link
                    href="/login"
                    className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign up
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
