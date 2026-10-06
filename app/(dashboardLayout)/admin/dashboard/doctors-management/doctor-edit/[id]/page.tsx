"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { getDoctorById, updateDoctor } from "@/services/doctor.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DoctorEditPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePhoto: "",
    contactNumber: "",
    address: "",
    appointmentFee: "",
    currentWorkingPlace: "",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await getDoctorById(id);

        setDoctor(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          profilePhoto: data.profilePhoto || "",
          contactNumber: data.contactNumber || "",
          address: data.address || "",
          appointmentFee: data.appointmentFee?.toString() || "",
          currentWorkingPlace: data.currentWorkingPlace || "",
        });
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
        toast.error("Failed to load doctor");
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!doctor) return;

    try {
      setIsUpdating(true);

      await updateDoctor(doctor.id, {
        name: formData.name,
        email: formData.email,
        profilePhoto: formData.profilePhoto,
        contactNumber: formData.contactNumber,
        address: formData.address,
        appointmentFee: Number(formData.appointmentFee),
        currentWorkingPlace: formData.currentWorkingPlace,
      });

      toast.success("Doctor updated successfully");

      router.push(
        `/admin/dashboard/doctors-management/doctor-details/${doctor.id}`,
      );
    } catch (error) {
      console.error("Failed to update doctor:", error);

      toast.error("Failed to update doctor");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!doctor) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-muted-foreground">Loading doctor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold">Update Doctor</h1>

            <p className="text-muted-foreground">
              Update the doctor's information.
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>

                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter doctor name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Profile Photo</Label>

                  <Input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="url"
                    value={formData.profilePhoto}
                    onChange={handleChange}
                    placeholder="Enter profile photo URL"
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>

                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                  />
                </div>

                {/* Appointment Fee */}
                <div className="space-y-2">
                  <Label htmlFor="appointmentFee">Appointment Fee</Label>

                  <Input
                    id="appointmentFee"
                    name="appointmentFee"
                    type="number"
                    min="0"
                    value={formData.appointmentFee}
                    onChange={handleChange}
                    placeholder="Enter appointment fee"
                    required
                  />
                </div>

                {/* Current Working Place */}
                <div className="space-y-2">
                  <Label htmlFor="currentWorkingPlace">
                    Current Working Place
                  </Label>

                  <Input
                    id="currentWorkingPlace"
                    name="currentWorkingPlace"
                    value={formData.currentWorkingPlace}
                    onChange={handleChange}
                    placeholder="Enter working place"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>

                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isUpdating}>
                  <Save className="mr-2 h-4 w-4" />

                  {isUpdating ? "Updating..." : "Update Doctor"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorEditPage;
