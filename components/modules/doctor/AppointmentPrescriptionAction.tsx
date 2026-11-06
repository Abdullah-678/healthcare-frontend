"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPrescription } from "@/services/prescription.service";

interface AppointmentPrescriptionActionProps {
  appointmentId: string;
}

const AppointmentPrescriptionAction = ({
  appointmentId,
}: AppointmentPrescriptionActionProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const followUpDate = formData.get("followUpDate");
    const instructions = formData.get("instructions");

    if (
      typeof followUpDate !== "string" ||
      typeof instructions !== "string" ||
      !followUpDate ||
      !instructions.trim()
    ) {
      toast.error("Enter a follow-up date and prescription instructions.");
      return;
    }

    setIsSaving(true);
    try {
      await createPrescription({
        appointmentId,
        followUpDate,
        instructions: instructions.trim(),
      });
      toast.success("Prescription created.");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to create prescription:", error);
      toast.error(
        error instanceof Error
          ? `Could not create prescription: ${error.message}`
          : "Could not create prescription. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full lg:w-auto">
      {!isOpen ? (
        <Button
          type="button"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          Write prescription
        </Button>
      ) : (
        <form
          className="w-full space-y-3 rounded-xl border border-slate-200 bg-white p-4 lg:w-80"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div>
            <label
              className="mb-1 block text-xs font-medium text-slate-700"
              htmlFor={`follow-up-${appointmentId}`}
            >
              Follow-up date
            </label>
            <Input
              id={`follow-up-${appointmentId}`}
              name="followUpDate"
              type="date"
              required
              disabled={isSaving}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium text-slate-700"
              htmlFor={`instructions-${appointmentId}`}
            >
              Prescription and instructions
            </label>
            <Textarea
              id={`instructions-${appointmentId}`}
              name="instructions"
              placeholder="Include medication, dosage, and instructions"
              required
              disabled={isSaving}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save prescription"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AppointmentPrescriptionAction;
