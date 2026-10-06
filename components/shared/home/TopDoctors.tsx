import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TopDoctors() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiologist",
      experience: "15 Years",
      location: "New York, USA",
      rating: 4.9,
      reviews: 128,
      imageUrl:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "12 Years",
      location: "San Francisco, USA",
      rating: 4.8,
      reviews: 95,
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "8 Years",
      location: "Chicago, USA",
      rating: 4.7,
      reviews: 210,
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&h=500&fit=crop",
    },
  ];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Top Rated Doctors
            </h2>

            <p className="text-lg text-muted-foreground">
              Book appointments with some of the most qualified and experienced
              medical professionals.
            </p>
          </div>

          <Link
            href="/consultation"
            className="hidden h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            Show All Doctors
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group flex h-full flex-col overflow-hidden border-border"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute right-4 top-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-white/90 font-semibold text-black hover:bg-white/90"
                  >
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    {doctor.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <h3 className="text-xl font-bold">{doctor.name}</h3>
                <p className="font-medium text-primary">{doctor.specialty}</p>
              </CardHeader>

              <CardContent className="flex pb-4">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{doctor.experience} Experience</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Link
                  href={`/consultation/${doctor.id}`}
                  className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book Appointment
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/consultation"
            className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            Show All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}
