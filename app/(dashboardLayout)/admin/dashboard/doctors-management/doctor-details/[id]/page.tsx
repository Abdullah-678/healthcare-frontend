import {
  Award,
  Briefcase,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDoctorById } from "@/services/doctor.service";

interface DoctorViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DoctorViewPage = async ({ params }: DoctorViewPageProps) => {
  const { id } = await params;

  const { data } = await getDoctorById(id);

  const initials = data.name
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-primary" />

          <CardContent className="relative px-6 pb-6 pt-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              {/* Doctor Profile */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={data.profilePhoto || undefined}
                    alt={data.name}
                  />

                  <AvatarFallback className="text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="pb-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold">{data.name}</h1>

                    <Badge>{data.designation}</Badge>
                  </div>

                  <p className="mt-2 text-muted-foreground">
                    {data.qualification}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{data.currentWorkingPlace || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-3">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                <div>
                  <p className="font-semibold">
                    {data.averageRating?.toFixed(1) || "0.0"}
                  </p>

                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Experience */}
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Experience</p>

                <p className="text-xl font-bold">
                  {data.experience || 0} Years
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-yellow-500/10 p-3">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>

                <p className="text-xl font-bold">
                  {data.averageRating?.toFixed(1) || "0.0"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Fee */}
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-green-500/10 p-3">
                <Award className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Appointment Fee</p>

                <p className="text-xl font-bold">৳{data.appointmentFee || 0}</p>
              </div>
            </CardContent>
          </Card>

          {/* Gender */}
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Gender</p>

                <p className="text-xl font-bold">
                  {data.gender || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Information */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Designation</p>

                <p className="mt-1 font-medium">
                  {data.designation || "Not provided"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Qualification</p>

                <p className="mt-1 font-medium">
                  {data.qualification || "Not provided"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">
                  Current Working Place
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />

                  <p className="font-medium">
                    {data.currentWorkingPlace || "Not provided"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Experience</p>

                <p className="mt-1 font-medium">{data.experience || 0} years</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>

                <div className="mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />

                  <p className="font-medium">{data.email || "Not provided"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>

                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />

                  <p className="font-medium">
                    {data.contactNumber || "Not provided"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Address</p>

                <div className="mt-1 flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

                  <p className="font-medium">
                    {data.address || "Not provided"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Gender</p>

                <div className="mt-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />

                  <p className="font-medium">{data.gender || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Doctor ID</p>

                <p className="mt-1 break-all font-mono text-sm">{data.id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>

                <div className="mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />

                  {/* <p className="font-medium">
                    {formatDate(data.createdAt)}
                  </p> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorViewPage;
