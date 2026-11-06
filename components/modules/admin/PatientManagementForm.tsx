"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createPatient,
  getPatientById,
  updatePatient,
} from "@/services/patient.service";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface ApiValidationError {
  path?: string;
  message: string;
}

interface ApiErrorData {
  message?: string;
  errorSources?: ApiValidationError[];
}

const getRequestErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return error instanceof Error ? error.message : "Unexpected error";
  }

  const response = error.response;
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response)
  ) {
    return error instanceof Error ? error.message : "Unexpected error";
  }

  const data = response.data as ApiErrorData;
  const validationMessage = data.errorSources
    ?.map(({ path, message }) => (path ? `${path}: ${message}` : message))
    .join(". ");

  return validationMessage || data.message || "Request failed";
};

interface PatientManagementFormProps {
  patientId?: string;
}

const PatientManagementForm = ({ patientId }: PatientManagementFormProps) => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
    contactNumber: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(Boolean(patientId));
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    let active = true;
    getPatientById(patientId)
      .then(({ data }) => {
        if (!active) return;
        setValues({
          name: data.name,
          email: data.email,
          password: "",
          profilePhoto: data.profilePhoto ?? "",
          contactNumber: data.contactNumber ?? "",
          address: data.address ?? "",
        });
      })
      .catch((error: unknown) => {
        console.error("Failed to load patient:", error);
        setLoadError(true);
        toast.error("Failed to load patient");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [patientId]);

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const patient = {
      name: values.name.trim(),
      ...(values.profilePhoto.trim()
        ? { profilePhoto: values.profilePhoto.trim() }
        : {}),
      ...(values.contactNumber.trim()
        ? { contactNumber: values.contactNumber.trim() }
        : {}),
      ...(values.address.trim() ? { address: values.address.trim() } : {}),
    };

    try {
      if (patientId) {
        await updatePatient(patientId, { patient });
        toast.success("Patient updated successfully");
      } else {
        const result = await createPatient({
          password: values.password,
          patient: { ...patient, email: values.email.trim().toLowerCase() },
        });
        if (!result.success) {
          setSaveError(result.message);
          toast.error(`Failed to save patient: ${result.message}`);
          return;
        }
        toast.success("Patient created successfully");
      }

      router.push("/admin/dashboard/patients-management");
      router.refresh();
    } catch (error: unknown) {
      console.error("Failed to save patient:", error);
      toast.error(`Failed to save patient: ${getRequestErrorMessage(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="py-12 text-center text-muted-foreground">Loading patient...</p>;
  }

  if (loadError) {
    return (
      <div role="alert" className="space-y-4">
        <p className="text-sm text-destructive">Unable to load this patient.</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard/patients-management")}
        >
          Back to patients
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{patientId ? "Edit Patient" : "Create Patient"}</CardTitle>
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
              <Label htmlFor="patient-name">Name</Label>
              <Input
                id="patient-name"
                required
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-email">Email</Label>
              <Input
                id="patient-email"
                type="email"
                required
                disabled={Boolean(patientId)}
                value={values.email}
                onChange={(event) =>
                  updateValue("email", event.target.value.toLowerCase())
                }
              />
            </div>
            {!patientId && (
              <div className="space-y-2">
                <Label htmlFor="patient-password">Temporary password</Label>
                <Input
                  id="patient-password"
                  type="password"
                  minLength={8}
                  required
                  value={values.password}
                  onChange={(event) => updateValue("password", event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The patient will be prompted to change this password at first login.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="patient-contact">Contact number</Label>
              <Input
                id="patient-contact"
                value={values.contactNumber}
                onChange={(event) =>
                  updateValue("contactNumber", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="patient-address">Address</Label>
              <Input
                id="patient-address"
                value={values.address}
                onChange={(event) => updateValue("address", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="patient-photo">Profile photo URL</Label>
              <Input
                id="patient-photo"
                type="text"
                value={values.profilePhoto}
                onChange={(event) =>
                  updateValue("profilePhoto", event.target.value)
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : patientId
                  ? "Save Changes"
                  : "Create Patient"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dashboard/patients-management")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientManagementForm;
