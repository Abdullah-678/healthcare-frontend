"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createDoctor,
  getDoctorById,
  updateDoctor,
} from "@/services/doctor.service";
import { getSpecialties, type ISpecialty } from "@/services/specialty.service";
import { Gender, type ICreateDoctorPayload } from "@/types/doctor.types";

interface DoctorManagementFormProps {
  doctorId?: string;
}

const doctorsPath = "/admin/dashboard/doctors-management";

const DoctorManagementForm = ({ doctorId }: DoctorManagementFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
    contactNumber: "",
    address: "",
    registrationNumber: "",
    experience: "",
    gender: Gender.MALE,
    appointmentFee: "",
    qualification: "",
    currentWorkingPlace: "",
    designation: "",
  });
  const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [originalSpecialtyIds, setOriginalSpecialtyIds] = useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadFormData = async () => {
      try {
        const specialtyResponse = await getSpecialties();
        if (!active) return;
        setSpecialties(specialtyResponse.data);

        if (doctorId) {
          const { data } = await getDoctorById(doctorId);
          if (!active) return;
          const doctorSpecialtyIds =
            data.specialties?.map(({ specialtyId }) => specialtyId) ?? [];
          setOriginalSpecialtyIds(doctorSpecialtyIds);
          setSelectedSpecialties(doctorSpecialtyIds);

          setValues({
            name: data.name ?? "",
            email: data.email ?? "",
            password: "",
            profilePhoto: data.profilePhoto ?? "",
            contactNumber: data.contactNumber ?? "",
            address: data.address ?? "",
            registrationNumber: data.registrationNumber ?? "",
            experience: data.experience?.toString() ?? "",
            gender: data.gender ?? Gender.MALE,
            appointmentFee: data.appointmentFee?.toString() ?? "",
            qualification: data.qualification ?? "",
            currentWorkingPlace: data.currentWorkingPlace ?? "",
            designation: data.designation ?? "",
          });
        }
      } catch (error: unknown) {
        console.error("Failed to load doctor form data:", error);
        const message =
          error instanceof Error ? error.message : "Unexpected error";
        setLoadError(message);
        toast.error(`Failed to load ${doctorId ? "doctor" : "specialties"}`);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadFormData();
    return () => {
      active = false;
    };
  }, [doctorId]);

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSpecialtyChange = (id: string) => {
    setSelectedSpecialties((current) =>
      current.includes(id)
        ? current.filter((specialtyId) => specialtyId !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      if (doctorId) {
        const result = await updateDoctor(doctorId, {
          name: values.name.trim(),
          profilePhoto: values.profilePhoto.trim() || undefined,
          contactNumber: values.contactNumber.trim() || undefined,
          address: values.address.trim() || undefined,
          registrationNumber: values.registrationNumber.trim(),
          experience: values.experience ? Number(values.experience) : undefined,
          gender: values.gender,
          appointmentFee: Number(values.appointmentFee),
          qualification: values.qualification.trim(),
          currentWorkingPlace: values.currentWorkingPlace.trim(),
          designation: values.designation.trim(),
          specialties: [
            ...originalSpecialtyIds
              .filter((id) => !selectedSpecialties.includes(id))
              .map((specialtyId) => ({ specialtyId, shouldDelete: true })),
            ...selectedSpecialties
              .filter((id) => !originalSpecialtyIds.includes(id))
              .map((specialtyId) => ({ specialtyId })),
          ],
        });

        if (!result.success) {
          setSaveError(result.message);
          toast.error(`Failed to update doctor: ${result.message}`);
          return;
        }

        toast.success("Doctor updated successfully");
      } else {
        if (selectedSpecialties.length === 0) {
          const message = "Select at least one specialty.";
          setSaveError(message);
          toast.error(message);
          return;
        }

        const payload: ICreateDoctorPayload = {
          password: values.password,
          doctor: {
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            ...(values.profilePhoto.trim()
              ? { profilePhoto: values.profilePhoto.trim() }
              : {}),
            ...(values.contactNumber.trim()
              ? { contactNumber: values.contactNumber.trim() }
              : {}),
            ...(values.address.trim() ? { address: values.address.trim() } : {}),
            registrationNumber: values.registrationNumber.trim(),
            ...(values.experience
              ? { experience: Number(values.experience) }
              : {}),
            gender: values.gender,
            appointmentFee: Number(values.appointmentFee),
            qualification: values.qualification.trim(),
            currentWorkingPlace: values.currentWorkingPlace.trim(),
            designation: values.designation.trim(),
          },
          specialties: selectedSpecialties,
        };
        const result = await createDoctor(payload);

        if (!result.success) {
          setSaveError(result.message);
          toast.error(`Failed to create doctor: ${result.message}`);
          return;
        }

        toast.success("Doctor created successfully");
      }

      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
      router.push(doctorsPath);
      router.refresh();
    } catch (error: unknown) {
      console.error("Failed to save doctor:", error);
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      setSaveError(message);
      toast.error(`Failed to ${doctorId ? "update" : "create"} doctor: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Loading {doctorId ? "doctor" : "specialties"}...
      </p>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="space-y-4">
        <p className="text-sm text-destructive">
          Unable to load form data: {loadError}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(doctorsPath)}
        >
          Back to doctors
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{doctorId ? "Edit Doctor" : "Create Doctor"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {saveError && (
            <p role="alert" className="text-sm text-destructive">
              {saveError}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="doctor-name">Name</Label>
              <Input
                id="doctor-name"
                required
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-email">Email</Label>
              <Input
                id="doctor-email"
                type="email"
                required
                disabled={Boolean(doctorId)}
                value={values.email}
                onChange={(event) =>
                  updateValue("email", event.target.value.toLowerCase())
                }
              />
            </div>
            {!doctorId && (
              <div className="space-y-2">
                <Label htmlFor="doctor-password">Temporary password</Label>
                <Input
                  id="doctor-password"
                  type="password"
                  minLength={8}
                  required
                  value={values.password}
                  onChange={(event) =>
                    updateValue("password", event.target.value)
                  }
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="doctor-registration">Registration number</Label>
              <Input
                id="doctor-registration"
                required
                value={values.registrationNumber}
                onChange={(event) =>
                  updateValue("registrationNumber", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-gender">Gender</Label>
              <select
                id="doctor-gender"
                value={values.gender}
                onChange={(event) =>
                  updateValue("gender", event.target.value as Gender)
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-fee">Appointment fee</Label>
              <Input
                id="doctor-fee"
                type="number"
                min="0"
                required
                value={values.appointmentFee}
                onChange={(event) =>
                  updateValue("appointmentFee", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-qualification">Qualification</Label>
              <Input
                id="doctor-qualification"
                required
                value={values.qualification}
                onChange={(event) =>
                  updateValue("qualification", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-designation">Designation</Label>
              <Input
                id="doctor-designation"
                required
                value={values.designation}
                onChange={(event) =>
                  updateValue("designation", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-workplace">Current working place</Label>
              <Input
                id="doctor-workplace"
                required
                value={values.currentWorkingPlace}
                onChange={(event) =>
                  updateValue("currentWorkingPlace", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-experience">Experience (years)</Label>
              <Input
                id="doctor-experience"
                type="number"
                min="0"
                value={values.experience}
                onChange={(event) =>
                  updateValue("experience", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-contact">Contact number</Label>
              <Input
                id="doctor-contact"
                type="tel"
                value={values.contactNumber}
                onChange={(event) =>
                  updateValue("contactNumber", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-photo">Profile photo URL</Label>
              <Input
                id="doctor-photo"
                type="url"
                value={values.profilePhoto}
                onChange={(event) =>
                  updateValue("profilePhoto", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="doctor-address">Address</Label>
              <Input
                id="doctor-address"
                value={values.address}
                onChange={(event) => updateValue("address", event.target.value)}
              />
            </div>
          </div>

          <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Specialties</legend>
              {specialties.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No specialties available. Add a specialty before managing a
                  doctor&apos;s specialties.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {specialties.map((specialty) => (
                    <label
                      key={specialty.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md border p-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(specialty.id)}
                        onChange={() => handleSpecialtyChange(specialty.id)}
                      />
                      <span>{specialty.title}</span>
                    </label>
                  ))}
                </div>
              )}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : doctorId
                  ? "Save Changes"
                  : "Create Doctor"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => router.push(doctorsPath)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorManagementForm;
