"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Search } from "lucide-react";

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
import { getAdminPrescriptions } from "@/services/prescription.service";

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

const PrescriptionsManagement = () => {
  const [search, setSearch] = useState("");
  const {
    data: prescriptions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-prescriptions"],
    queryFn: getAdminPrescriptions,
  });

  const filteredPrescriptions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return [...prescriptions]
      .filter((prescription) => {
        if (!searchTerm) return true;
        return [
          prescription.id,
          prescription.patient?.name,
          prescription.appointment?.patient?.name,
          prescription.doctor?.name,
          prescription.instructions,
          prescription.appointmentId,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
  }, [prescriptions, search]);

  const followUpsDue = prescriptions.filter(({ followUpDate }) => {
    const followUp = new Date(followUpDate);
    return !Number.isNaN(followUp.getTime()) && followUp < new Date();
  }).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Prescription Management</h1>
        <p className="text-sm text-muted-foreground">
          Review prescriptions and follow-up dates across patients and doctors.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Total prescriptions <FileText className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : prescriptions.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Follow-ups scheduled</p>
          <p className="mt-3 text-3xl font-semibold">
            {prescriptions.filter(({ followUpDate }) => Boolean(followUpDate)).length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Follow-up dates passed</p>
          <p className="mt-3 text-3xl font-semibold">{followUpsDue}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All prescriptions</h2>
            <p className="text-sm text-muted-foreground">
              Prescription instructions are visible to authorized staff.
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search prescriptions"
              className="pl-9"
              placeholder="Search patient, doctor, or instructions"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {isError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? `Unable to load prescriptions: ${error.message}`
                : "Unable to load prescriptions."}
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
                  <TableHead>Prescription</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Instructions</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading prescriptions...
                    </TableCell>
                  </TableRow>
                ) : filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {prescriptions.length
                        ? "No prescriptions match your search."
                        : "No prescriptions found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">
                        {prescription.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        {prescription.patient?.name ??
                          prescription.appointment?.patient?.name ??
                          "Unknown patient"}
                      </TableCell>
                      <TableCell>
                        {prescription.doctor?.name ?? prescription.doctorId}
                      </TableCell>
                      <TableCell className="max-w-sm whitespace-normal">
                        {prescription.instructions}
                      </TableCell>
                      <TableCell>{formatDate(prescription.createdAt)}</TableCell>
                      <TableCell>{formatDate(prescription.followUpDate)}</TableCell>
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

export default PrescriptionsManagement;
