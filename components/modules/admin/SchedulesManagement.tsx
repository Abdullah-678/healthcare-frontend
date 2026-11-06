"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock3, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createSchedules,
  deleteSchedule,
  getSchedules,
  type Schedule,
  type SchedulePayload,
  updateSchedule,
} from "@/services/schedule.service";

const noSchedules: Schedule[] = [];

const emptyForm: SchedulePayload = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
};

const toLocalDateTimeInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const toSchedulePayload = (
  startDateTime: string,
  endDateTime: string,
): SchedulePayload => ({
  startDate: startDateTime.slice(0, 10),
  endDate: endDateTime.slice(0, 10),
  startTime: startDateTime.slice(11, 16),
  endTime: endDateTime.slice(11, 16),
});

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const SchedulesManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: scheduleResult,
    isLoading,
    isError: queryError,
    refetch,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });
  const schedules =
    scheduleResult?.success === true ? scheduleResult.data : noSchedules;
  const loadError =
    scheduleResult && !scheduleResult.success ? scheduleResult.message : null;

  const filteredSchedules = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return [...schedules]
      .filter(
        (schedule) =>
          !searchTerm ||
          schedule.id.toLowerCase().includes(searchTerm) ||
          formatDateTime(schedule.startDateTime).toLowerCase().includes(searchTerm) ||
          formatDateTime(schedule.endDateTime).toLowerCase().includes(searchTerm),
      )
      .sort(
        (first, second) =>
          new Date(first.startDateTime).getTime() -
          new Date(second.startDateTime).getTime(),
      );
  }, [schedules, search]);

  const refreshSchedules = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["schedules"] }),
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] }),
    ]);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.endDate < form.startDate || form.endTime <= form.startTime) {
      toast.error("Choose an end date and time after the start.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createSchedules(form);
      if (!result.success) {
        toast.error(`Could not create schedules: ${result.message}`);
        return;
      }

      if (result.data.length === 0) {
        toast.info("No new slots were created; those time slots may already exist.");
      } else {
        toast.success(
          `${result.data.length} schedule ${result.data.length === 1 ? "slot" : "slots"} created.`,
        );
      }
      setForm(emptyForm);
      await refreshSchedules();
    } finally {
      setIsSaving(false);
    }
  };

  const beginEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setEditStart(toLocalDateTimeInput(schedule.startDateTime));
    setEditEnd(toLocalDateTimeInput(schedule.endDateTime));
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSchedule || !editStart || !editEnd) return;
    if (new Date(editEnd) <= new Date(editStart)) {
      toast.error("The end time must be after the start time.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateSchedule(
        editingSchedule.id,
        toSchedulePayload(editStart, editEnd),
      );
      if (!result.success) {
        toast.error(`Could not update schedule: ${result.message}`);
        return;
      }

      toast.success("Schedule updated successfully.");
      setEditingSchedule(null);
      await refreshSchedules();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (schedule: Schedule) => {
    if (isSaving) return;

    const confirmed = window.confirm(
      "Delete this schedule slot? Any doctor availability or appointments linked to it may also be removed.",
    );
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const result = await deleteSchedule(schedule.id);
      if (!result.success) {
        toast.error(`Could not delete schedule: ${result.message}`);
        return;
      }

      toast.success("Schedule deleted.");
      await refreshSchedules();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage 30-minute schedule slots available for doctors.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Total slots <CalendarDays className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : schedules.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Upcoming slots <Clock3 className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {
              schedules.filter(
                ({ startDateTime }) => new Date(startDateTime) >= new Date(),
              ).length
            }
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Past slots <CalendarDays className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {
              schedules.filter(
                ({ startDateTime }) => new Date(startDateTime) < new Date(),
              ).length
            }
          </p>
        </article>
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Generate schedule slots</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The selected time range is split into 30-minute slots for each date.
          Existing duplicate slots are skipped.
        </p>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={handleCreate}
        >
          <div className="space-y-2">
            <label htmlFor="schedule-start-date" className="text-sm font-medium">
              Start date
            </label>
            <Input
              id="schedule-start-date"
              type="date"
              required
              value={form.startDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, startDate: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="schedule-end-date" className="text-sm font-medium">
              End date
            </label>
            <Input
              id="schedule-end-date"
              type="date"
              required
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, endDate: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="schedule-start-time" className="text-sm font-medium">
              Daily start time
            </label>
            <Input
              id="schedule-start-time"
              type="time"
              required
              value={form.startTime}
              onChange={(event) =>
                setForm((current) => ({ ...current, startTime: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="schedule-end-time" className="text-sm font-medium">
              Daily end time
            </label>
            <Input
              id="schedule-end-time"
              type="time"
              required
              value={form.endTime}
              onChange={(event) =>
                setForm((current) => ({ ...current, endTime: event.target.value }))
              }
            />
          </div>
          <Button
            type="submit"
            className="sm:col-span-2 lg:col-span-4"
            disabled={isSaving}
          >
            <Plus aria-hidden="true" />
            {isSaving ? "Creating slots..." : "Generate slots"}
          </Button>
        </form>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All schedule slots</h2>
            <p className="text-sm text-muted-foreground">
              Edit or remove a schedule slot.
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search schedule slots"
              className="pl-9"
              placeholder="Search by date or slot ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {queryError || loadError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {loadError ?? "Unable to load schedules."}
            </p>
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead>Ends</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading schedules...
                    </TableCell>
                  </TableRow>
                ) : filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {schedules.length
                        ? "No schedule slots match your search."
                        : "No schedule slots found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        {schedule.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{formatDateTime(schedule.startDateTime)}</TableCell>
                      <TableCell>{formatDateTime(schedule.endDateTime)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSaving}
                            onClick={() => beginEdit(schedule)}
                          >
                            <Pencil aria-hidden="true" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isSaving}
                            onClick={() => void handleDelete(schedule)}
                          >
                            <Trash2 aria-hidden="true" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            aria-labelledby="edit-schedule-title"
            aria-modal="true"
            role="dialog"
            className="w-full max-w-lg space-y-4 rounded-xl bg-background p-6 shadow-xl"
          >
            <div>
              <h2 id="edit-schedule-title" className="text-lg font-semibold">
                Edit schedule slot
              </h2>
              <p className="text-sm text-muted-foreground">
                Update the start and end times for this slot.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div className="space-y-2">
                <label htmlFor="edit-schedule-start" className="text-sm font-medium">
                  Starts
                </label>
                <Input
                  id="edit-schedule-start"
                  type="datetime-local"
                  required
                  value={editStart}
                  onChange={(event) => setEditStart(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-schedule-end" className="text-sm font-medium">
                  Ends
                </label>
                <Input
                  id="edit-schedule-end"
                  type="datetime-local"
                  required
                  min={editStart}
                  value={editEnd}
                  onChange={(event) => setEditEnd(event.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => setEditingSchedule(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default SchedulesManagement;
