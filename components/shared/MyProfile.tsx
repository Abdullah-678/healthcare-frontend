import { getUserInfo } from "@/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, ShieldCheck } from "lucide-react";

export default async function ProfilePage() {
  const user = await getUserInfo();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.profilePhoto || user.image || ""}
              alt={user.name}
            />
            <AvatarFallback className="text-xl">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>

            <p className="text-muted-foreground">{user.email}</p>

            <div className="mt-2 flex justify-center gap-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>

              <Badge>{user.status || "ACTIVE"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user.name || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{user.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{user.role || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Account Status</p>

            <Badge className="mt-2">{user.status || "ACTIVE"}</Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Password Status</p>

            <p className="mt-1 font-medium">
              {user.needPasswordChange
                ? "Password change required"
                : "Password is up to date"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
