"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { scheduleAppointmentRequest } from "@/services/appointment.service";
import type { DoctorDashboardSchedule } from "@/services/doctor-dashboard.service";

interface ScheduleAppointmentActionProps {
  appointmentId: string;
  schedules: DoctorDashboardSchedule[];
}

const formatSchedule = (schedule: DoctorDashboardSchedule["schedule"]) =>
  `${new Date(schedule.startDateTime).toLocaleString()} – ${new Date(
    schedule.endDateTime,
  ).toLocaleTimeString()}`;

const ScheduleAppointmentAction = ({
  appointmentId,
  schedules,
}: ScheduleAppointmentActionProps) => {
  const router = useRouter();
  const [scheduleId, setScheduleId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSchedule = async () => {
    if (!scheduleId) return;

    setIsSaving(true);
    try {
      await scheduleAppointmentRequest(appointmentId, scheduleId);
      toast.success("Appointment scheduled.");
      router.refresh();
    } catch (error) {
      console.error("Failed to schedule appointment request:", error);
      toast.error(
        error instanceof Error
          ? `Could not schedule appointment: ${error.message}`
          : "Could not schedule appointment. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor={`schedule-${appointmentId}`}>
        Choose an available time
      </label>
      <select
        id={`schedule-${appointmentId}`}
        className="h-9 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
        value={scheduleId}
        onChange={(event) => setScheduleId(event.target.value)}
        disabled={isSaving}
      >
        <option value="">Choose a time</option>
        {schedules.map(({ scheduleId: id, schedule }) => (
          <option key={id} value={id}>
            {formatSchedule(schedule)}
          </option>
        ))}
      </select>
      <Button
        type="button"
        size="sm"
        disabled={!scheduleId || isSaving}
        onClick={() => void handleSchedule()}
      >
        {isSaving ? "Scheduling..." : "Schedule appointment"}
      </Button>
    </div>
  );
};

export default ScheduleAppointmentAction;
