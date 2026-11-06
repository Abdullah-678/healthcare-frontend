"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Stethoscope } from "lucide-react";

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
import { getDoctors } from "@/services/doctor.service";
import { getSpecialties } from "@/services/specialty.service";
import type { IDoctor } from "@/types/doctor.types";

const noDoctors: IDoctor[] = [];

const DoctorSpecialtiesManagement = () => {
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const {
    data: doctorResponse,
    isLoading: isLoadingDoctors,
    isError: doctorsError,
    error: doctorsLoadError,
    refetch: refetchDoctors,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });
  const {
    data: specialtyResponse,
    isLoading: isLoadingSpecialties,
    isError: specialtiesError,
    error: specialtiesLoadError,
    refetch: refetchSpecialties,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
  });

  const doctors = doctorResponse?.data ?? noDoctors;
  const specialties = specialtyResponse?.data ?? [];
  const filteredDoctors = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const assignedSpecialties = doctor.specialties ?? [];
      const matchesSpecialty =
        specialtyFilter === "all" ||
        assignedSpecialties.some(
          ({ specialtyId }) => specialtyId === specialtyFilter,
        );
      const matchesSearch =
        !searchTerm ||
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.email.toLowerCase().includes(searchTerm) ||
        assignedSpecialties.some(({ specialty }) =>
          specialty?.title.toLowerCase().includes(searchTerm),
        );

      return matchesSpecialty && matchesSearch;
    });
  }, [doctors, search, specialtyFilter]);

  const isLoading = isLoadingDoctors || isLoadingSpecialties;
  const loadError = doctorsError
    ? doctorsLoadError
    : specialtiesError
      ? specialtiesLoadError
      : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Doctor Specialties</h1>
        <p className="text-sm text-muted-foreground">
          Review specialty assignments and manage them from a doctor’s profile.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Doctors</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : doctors.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Specialties</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : specialties.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Doctors without specialties</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading
              ? "…"
              : doctors.filter((doctor) => !doctor.specialties?.length).length}
          </p>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search doctors and specialties"
              className="pl-9"
              placeholder="Search doctors or specialties"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter doctors by specialty"
            className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            value={specialtyFilter}
            onChange={(event) => setSpecialtyFilter(event.target.value)}
          >
            <option value="all">All specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.title}
              </option>
            ))}
          </select>
        </div>

        {loadError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {loadError instanceof Error
                ? `Unable to load specialty assignments: ${loadError.message}`
                : "Unable to load specialty assignments."}
            </p>
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetchDoctors()}
              >
                Retry doctors
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetchSpecialties()}
              >
                Retry specialties
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Assigned specialties</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Loading doctor assignments...
                    </TableCell>
                  </TableRow>
                ) : filteredDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {doctors.length
                        ? "No doctors match these filters."
                        : "No doctors found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {doctor.specialties?.length ? (
                            doctor.specialties.map(({ specialtyId, specialty }) => (
                              <Badge key={specialtyId} variant="secondary">
                                {specialty?.title ?? "Unknown specialty"}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No specialties assigned
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            render={
                              <Link
                                href={`/admin/dashboard/doctors-management/doctor-edit/${doctor.id}`}
                              />
                            }
                            nativeButton={false}
                            variant="outline"
                            size="sm"
                          >
                            <Stethoscope aria-hidden="true" />
                            Manage
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
    </div>
  );
};

export default DoctorSpecialtiesManagement;
