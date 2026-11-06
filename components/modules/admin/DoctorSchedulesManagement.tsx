"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { getAdminDoctorSchedules } from "@/services/doctor-schedule.service";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "Time not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

const DoctorSchedulesManagement = () => {
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const {
    data: schedules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["doctor-schedules"],
    queryFn: getAdminDoctorSchedules,
  });

  const filteredSchedules = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return [...schedules]
      .filter((schedule) => {
        if (availabilityFilter === "BOOKED") return schedule.isBooked;
        if (availabilityFilter === "AVAILABLE") return !schedule.isBooked;
        return true;
      })
      .filter((schedule) => {
        if (!searchTerm) return true;
        return [
          schedule.id,
          schedule.scheduleId,
          schedule.doctorId,
          schedule.doctor?.name,
          schedule.schedule?.startDateTime,
          schedule.schedule?.endDateTime,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .sort((first, second) => {
        const firstStart = first.schedule?.startDateTime;
        const secondStart = second.schedule?.startDateTime;
        if (!firstStart) return 1;
        if (!secondStart) return -1;
        return new Date(firstStart).getTime() - new Date(secondStart).getTime();
      });
  }, [availabilityFilter, schedules, search]);

  const bookedCount = schedules.filter(({ isBooked }) => isBooked).length;
  const availableCount = schedules.length - bookedCount;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Doctor Schedules Management</h1>
        <p className="text-sm text-muted-foreground">
          Review doctor availability and booked schedule slots.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Total assignments <CalendarClock className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : schedules.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Available slots</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : availableCount}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Booked slots</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : bookedCount}
          </p>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">Doctor schedule assignments</h2>
          <p className="text-sm text-muted-foreground">
            Availability and booking state for assigned doctor slots.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search doctor schedules"
              className="pl-9"
              placeholder="Search doctor, schedule, or ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter schedules by availability"
            className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            value={availabilityFilter}
            onChange={(event) => setAvailabilityFilter(event.target.value)}
          >
            <option value="ALL">All slots</option>
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
          </select>
        </div>

        {isError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? `Unable to load doctor schedules: ${error.message}`
                : "Unable to load doctor schedules."}
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
                  <TableHead>Doctor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Assignment ID</TableHead>
                  <TableHead>Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading doctor schedules...
                    </TableCell>
                  </TableRow>
                ) : filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {schedules.length
                        ? "No schedule assignments match your filters."
                        : "No doctor schedule assignments found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <p className="font-medium">
                          {schedule.doctor?.name ?? "Doctor"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.doctorId}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>{formatDateTime(schedule.schedule?.startDateTime)}</p>
                        <p className="text-sm text-muted-foreground">
                          to {formatDateTime(schedule.schedule?.endDateTime)}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">
                        {schedule.scheduleId.slice(0, 10)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={schedule.isBooked ? "secondary" : "default"}
                        >
                          {schedule.isBooked ? "Booked" : "Available"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DoctorSchedulesManagement;
