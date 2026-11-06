"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  updateDoctorAppointmentStatus,
  type DoctorAppointmentStatus,
} from "@/services/appointment.service";

interface AppointmentStatusActionProps {
  appointmentId: string;
  nextStatus: DoctorAppointmentStatus;
}

const actionLabels: Record<DoctorAppointmentStatus, string> = {
  INPROGRESS: "Start consultation",
  COMPLETED: "Mark completed",
};

const AppointmentStatusAction = ({
  appointmentId,
  nextStatus,
}: AppointmentStatusActionProps) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (
      nextStatus === "COMPLETED" &&
      !window.confirm("Mark this consultation as completed?")
    ) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateDoctorAppointmentStatus(appointmentId, nextStatus);
      toast.success(
        nextStatus === "COMPLETED"
          ? "Appointment marked as completed."
          : "Consultation started.",
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      toast.error(
        error instanceof Error
          ? `Could not update appointment: ${error.message}`
          : "Could not update appointment. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={nextStatus === "COMPLETED" ? "default" : "outline"}
      disabled={isUpdating}
      onClick={() => void handleUpdate()}
    >
      {isUpdating ? "Updating..." : actionLabels[nextStatus]}
    </Button>
  );
};

export default AppointmentStatusAction;
