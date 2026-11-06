"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Search,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminAppointments } from "@/services/appointment.service";

const formatLabel = (value: string | null | undefined) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not available";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const statusVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "default";
    case "CANCELED":
    case "CANCELLED":
      return "destructive";
    case "REQUESTED":
      return "outline";
    default:
      return "secondary";
  }
};

const AppointmentsManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: getAdminAppointments,
  });

  const statuses = useMemo(
    () => [...new Set(appointments.map((appointment) => appointment.status))].sort(),
    [appointments],
  );
  const filteredAppointments = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return appointments
      .filter(
        (appointment) =>
          statusFilter === "ALL" || appointment.status === statusFilter,
      )
      .filter((appointment) => {
        if (!searchTerm) return true;

        return [
          appointment.id,
          appointment.patient?.name,
          appointment.patient?.email,
          appointment.doctor?.name,
          appointment.doctor?.specialization,
          appointment.status,
          appointment.paymentStatus,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .sort((first, second) => {
        const firstDate = first.schedule?.startDateTime ?? first.createdAt;
        const secondDate = second.schedule?.startDateTime ?? second.createdAt;
        return new Date(secondDate).getTime() - new Date(firstDate).getTime();
      });
  }, [appointments, search, statusFilter]);

  const requestedCount = appointments.filter(
    ({ status }) => status.toUpperCase() === "REQUESTED",
  ).length;
  const scheduledCount = appointments.filter(
    ({ status }) =>
      ["SCHEDULED", "INPROGRESS"].includes(status.toUpperCase()),
  ).length;
  const completedCount = appointments.filter(
    ({ status }) => status.toUpperCase() === "COMPLETED",
  ).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <p className="text-sm text-muted-foreground">
          Review and track appointments across patients and doctors.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Total appointments <CalendarDays className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : appointments.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Requested <Users className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">{requestedCount}</p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Scheduled / in progress <Clock3 className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">{scheduledCount}</p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Completed <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">{completedCount}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search appointments"
              className="pl-9"
              placeholder="Search patient, doctor, or appointment..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter appointments by status"
            className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {isError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? `Unable to load appointments: ${error.message}`
                : "Unable to load appointments."}
            </p>
            <button
              type="button"
              className="text-sm font-medium underline underline-offset-4"
              onClick={() => void refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading appointments...
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {appointments.length === 0
                        ? "No appointments found."
                        : "No appointments match your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        <span className="block">
                          #{appointment.id.slice(0, 8)}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          Created {formatDateTime(appointment.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block">
                          {appointment.patient?.name ?? "Unknown patient"}
                        </span>
                        {appointment.patient?.email && (
                          <span className="text-xs text-muted-foreground">
                            {appointment.patient.email}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="block">
                          {appointment.doctor?.name ?? "Unknown doctor"}
                        </span>
                        {appointment.doctor?.specialization && (
                          <span className="text-xs text-muted-foreground">
                            {appointment.doctor.specialization}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {appointment.schedule ? (
                          <>
                            <span className="block">
                              {formatDateTime(
                                appointment.schedule.startDateTime,
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ends{" "}
                              {formatDateTime(
                                appointment.schedule.endDateTime,
                              )}
                            </span>
                          </>
                        ) : (
                          "Awaiting schedule"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(appointment.status)}>
                          {formatLabel(appointment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard
                            aria-hidden="true"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          {formatLabel(appointment.paymentStatus)}
                        </span>
                        {appointment.doctor?.appointmentFee != null && (
                          <span className="block text-xs text-muted-foreground">
                            ৳{appointment.doctor.appointmentFee}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        {!isError && (
          <p className="text-xs text-muted-foreground">
            Showing {filteredAppointments.length} of {appointments.length}{" "}
            appointments.
          </p>
        )}
      </section>
    </div>
  );
};

export default AppointmentsManagement;
