"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAdmin,
  getAdminById,
  updateAdmin,
} from "@/services/admin.service";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminApiErrorData {
  message?: string;
  errorSources?: Array<{ path?: string; message: string }>;
}

const getSaveErrorMessage = (error: unknown, isCreatingAdmin: boolean) => {
  if (axios.isAxiosError<AdminApiErrorData>(error)) {
    if (isCreatingAdmin && error.response?.status === 409) {
      return "This email is already in use. Please use a different email address.";
    }

    const data = error.response?.data;
    const validationMessage = data?.errorSources
      ?.map(({ path, message }) => (path ? `${path}: ${message}` : message))
      .join(". ");

    return validationMessage || data?.message || error.message;
  }

  return error instanceof Error ? error.message : "Unexpected error";
};

interface AdminManagementFormProps {
  adminId?: string;
}

const AdminManagementForm = ({ adminId }: AdminManagementFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
    contactNumber: "",
  });
  const [isLoading, setIsLoading] = useState(Boolean(adminId));
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!adminId) return;

    let active = true;
    getAdminById(adminId)
      .then(({ data }) => {
        if (!active) return;
        setValues({
          name: data.name,
          email: data.email,
          password: "",
          profilePhoto: data.profilePhoto ?? "",
          contactNumber: data.contactNumber ?? "",
        });
      })
      .catch((error: unknown) => {
        console.error("Failed to load admin:", error);
        setLoadError(true);
        toast.error("Failed to load admin");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [adminId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const admin = {
      name: values.name.trim(),
      ...(values.profilePhoto.trim()
        ? { profilePhoto: values.profilePhoto.trim() }
        : {}),
      ...(values.contactNumber.trim()
        ? { contactNumber: values.contactNumber.trim() }
        : {}),
    };

    try {
      if (adminId) {
        await updateAdmin(adminId, { admin });
        toast.success("Admin updated successfully");
      } else {
        const result = await createAdmin({
          password: values.password,
          admin: { ...admin, email: values.email.trim().toLowerCase() },
        });
        if (!result.success) {
          setSaveError(result.message);
          toast.error(`Failed to create admin: ${result.message}`);
          return;
        }
        toast.success("Admin created successfully");
      }

      await queryClient.invalidateQueries({ queryKey: ["admins"] });
      router.push("/admin/dashboard/admins-management");
      router.refresh();
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        console.error("Failed to save admin:", error);
      }
      const message = getSaveErrorMessage(error, !adminId);
      setSaveError(message);
      toast.error(`Failed to ${adminId ? "update" : "create"} admin: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  if (isLoading) {
    return <p className="py-12 text-center text-muted-foreground">Loading admin...</p>;
  }

  if (loadError) {
    return (
      <div role="alert" className="space-y-4">
        <p className="text-sm text-destructive">Unable to load this admin.</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard/admins-management")}
        >
          Back to admins
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{adminId ? "Edit Admin" : "Create Admin"}</CardTitle>
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
              <Label htmlFor="admin-name">Name</Label>
              <Input
                id="admin-name"
                required
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                required
                disabled={Boolean(adminId)}
                value={values.email}
                onChange={(event) =>
                  updateValue("email", event.target.value.toLowerCase())
                }
              />
            </div>
            {!adminId && (
              <div className="space-y-2">
                <Label htmlFor="admin-password">Temporary password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  minLength={8}
                  required
                  value={values.password}
                  onChange={(event) => updateValue("password", event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The admin will be prompted to change this password at first login.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="admin-contact">Contact number</Label>
              <Input
                id="admin-contact"
                value={values.contactNumber}
                onChange={(event) =>
                  updateValue("contactNumber", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="admin-photo">Profile photo URL</Label>
              <Input
                id="admin-photo"
                type="url"
                value={values.profilePhoto}
                onChange={(event) =>
                  updateValue("profilePhoto", event.target.value)
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : adminId ? "Save Changes" : "Create Admin"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dashboard/admins-management")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminManagementForm;
