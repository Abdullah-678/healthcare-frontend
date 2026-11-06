import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserStatus } from "@/types/doctor.types";
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

interface AccountDetailProps {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  role: string;
  status: UserStatus;
  createdAt: string;
  backHref: string;
  editHref?: string;
}

const AccountDetail = ({
  id,
  name,
  email,
  profilePhoto,
  contactNumber,
  address,
  role,
  status,
  createdAt,
  backHref,
  editHref,
}: AccountDetailProps) => {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="overflow-hidden">
          <div className="h-32 bg-primary" />
          <CardContent className="relative px-6 pb-6 pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={profilePhoto || undefined} alt={name} />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold">{name}</h1>
                  <Badge>{role}</Badge>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {contactNumber || "Contact information not provided"}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Role</p>
                <p className="text-xl font-bold">{role}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-green-500/10 p-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    status === "ACTIVE"
                      ? "default"
                      : status === "BLOCKED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {status.toLowerCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-bold">{formattedCreatedAt}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-yellow-500/10 p-3">
                <Phone className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="text-lg font-bold">{contactNumber || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="mt-1 font-medium">{name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="mt-1 font-medium">{role}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="mt-1 font-medium capitalize">
                  {status.toLowerCase()}
                </p>
              </div>
            </CardContent>
          </Card>

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
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{contactNumber || "Not provided"}</p>
                </div>
              </div>
              {address !== undefined && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="mt-1 flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{address || "Not provided"}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Account ID</p>
              <p className="mt-1 break-all font-mono text-sm">{id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Created</p>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{formattedCreatedAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link
            href={backHref}
            className={buttonVariants({ variant: "outline" })}
          >
            Back to list
          </Link>
          {editHref && (
            <Link href={editHref} className={buttonVariants()}>
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
