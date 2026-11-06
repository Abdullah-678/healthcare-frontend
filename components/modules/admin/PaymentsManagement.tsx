"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Search } from "lucide-react";

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
import { getAdminAppointments } from "@/services/appointment.service";

const formatLabel = (value: string | null | undefined) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not available";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const paymentVariant = (
  status: string | null | undefined,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "default";
    case "PENDING":
      return "outline";
    case "UNPAID":
    case "FAILED":
      return "destructive";
    default:
      return "secondary";
  }
};

const PaymentsManagement = () => {
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
    () =>
      [...new Set(appointments.map(({ paymentStatus }) => paymentStatus).filter(
        (status): status is string => Boolean(status),
      ))].sort(),
    [appointments],
  );
  const filteredAppointments = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return appointments
      .filter(
        ({ paymentStatus }) =>
          statusFilter === "ALL" || paymentStatus === statusFilter,
      )
      .filter((appointment) => {
        if (!searchTerm) return true;
        return [
          appointment.id,
          appointment.patient?.name,
          appointment.patient?.email,
          appointment.doctor?.name,
          appointment.paymentStatus,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
  }, [appointments, search, statusFilter]);

  const paidAppointments = appointments.filter(
    ({ paymentStatus }) => paymentStatus?.toUpperCase() === "PAID",
  );
  const paidTotal = paidAppointments.reduce(
    (total, appointment) => total + (appointment.doctor?.appointmentFee ?? 0),
    0,
  );
  const pendingCount = appointments.filter(
    ({ paymentStatus }) => paymentStatus?.toUpperCase() === "PENDING",
  ).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <p className="text-sm text-muted-foreground">
          Review payment status and appointment fees for all appointments.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Payment records <CreditCard className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : appointments.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pending payments</p>
          <p className="mt-3 text-3xl font-semibold">{pendingCount}</p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Fees for paid visits</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : `৳${paidTotal.toLocaleString("en-BD")}`}
          </p>
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
              aria-label="Search payment records"
              className="pl-9"
              placeholder="Search patient, doctor, or appointment"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter payments by status"
            className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All payment statuses</option>
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
                ? `Unable to load payment records: ${error.message}`
                : "Unable to load payment records."}
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
                  <TableHead>Appointment</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Payment status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading payment records...
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {appointments.length
                        ? "No payment records match your filters."
                        : "No payment records found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        {appointment.patient?.name ?? "Unknown patient"}
                      </TableCell>
                      <TableCell>
                        {appointment.doctor?.name ?? "Unknown doctor"}
                      </TableCell>
                      <TableCell>
                        {appointment.doctor?.appointmentFee == null
                          ? "Not available"
                          : `৳${appointment.doctor.appointmentFee.toLocaleString("en-BD")}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentVariant(appointment.paymentStatus)}>
                          {formatLabel(appointment.paymentStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(appointment.createdAt)}</TableCell>
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

export default PaymentsManagement;
