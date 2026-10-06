import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      {/* Decorative background blob */}
      <div className="absolute inset-0 z-0 bg-primary/5 mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)" />
      <div className="absolute right-0 top-0 -z-10 h-500px w-500px rounded-full bg-primary/10 blur-[100px] md:right-20 md:top-20" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Activity className="mr-2 h-4 w-4" />
                Your Health, Our Priority
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
                Advanced Healthcare <br />
                <span className="text-primary">Made Simple</span>
              </h1>

              <p className="max-w-600px text-lg text-muted-foreground sm:text-xl">
                Experience world-class medical services from the comfort of your
                home. Connect with top doctors, book appointments, and manage
                your health journey seamlessly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Book Appointment */}
              <Link
                href="/consultation"
                className="group inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Book an Appointment
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Explore Services */}
              <Link
                href="/diagnostics"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground sm:w-auto"
              >
                Explore Services
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">50+</h3>
                <p className="text-sm text-muted-foreground">Specialists</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">24/7</h3>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">10k+</h3>
                <p className="text-sm text-muted-foreground">Patients</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-500px lg:max-w-none">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-xl sm:aspect-4/3 lg:aspect-square">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent mix-blend-overlay" />

              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform duration-500 group-hover:scale-110">
                  <Activity className="h-12 w-12" />
                </div>

                <h3 className="mb-2 text-xl font-bold">Modern Care</h3>

                <p className="text-sm text-muted-foreground">
                  Empowering your health with technology
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-lg">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              </div>

              <div>
                <p className="text-sm font-semibold">Live Doctors</p>
                <p className="text-xs text-muted-foreground">Available now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
