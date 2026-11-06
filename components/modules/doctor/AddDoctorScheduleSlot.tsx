"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addMyDoctorSchedule } from "@/services/doctor-schedule.service";
import type { Schedule } from "@/services/schedule.service";

interface AddDoctorScheduleSlotProps {
  schedules: Schedule[];
}

const formatSchedule = (schedule: Schedule) =>
  `${new Date(schedule.startDateTime).toLocaleString()} – ${new Date(
    schedule.endDateTime,
  ).toLocaleTimeString()}`;

const AddDoctorScheduleSlot = ({
  schedules,
}: AddDoctorScheduleSlotProps) => {
  const router = useRouter();
  const [scheduleId, setScheduleId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSlot = async () => {
    if (!scheduleId) return;

    setIsSaving(true);
    try {
      await addMyDoctorSchedule(scheduleId);
      toast.success("Availability slot added.");
      setScheduleId("");
      router.refresh();
    } catch (error) {
      console.error("Failed to add doctor schedule slot:", error);
      toast.error(
        error instanceof Error
          ? `Could not add slot: ${error.message}`
          : "Could not add slot. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (schedules.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No future schedule slots are available to add. Ask an administrator to
        create schedule slots first.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="doctor-schedule-slot">
        Choose an available slot
      </label>
      <select
        id="doctor-schedule-slot"
        className="h-9 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
        value={scheduleId}
        onChange={(event) => setScheduleId(event.target.value)}
        disabled={isSaving}
      >
        <option value="">Choose a slot to add</option>
        {schedules.map((schedule) => (
          <option key={schedule.id} value={schedule.id}>
            {formatSchedule(schedule)}
          </option>
        ))}
      </select>
      <Button
        type="button"
        size="sm"
        disabled={!scheduleId || isSaving}
        onClick={() => void handleAddSlot()}
      >
        {isSaving ? "Adding..." : "Add slot"}
      </Button>
    </div>
  );
};

export default AddDoctorScheduleSlot;
