"use client";

import DataTable from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { deletePatient, getPatients } from "@/services/patient.service";
import { IPatient } from "@/types/patient.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { patientColumns } from "./patientsColumns";

const PatientsTable = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  const patients = data?.data ?? [];
  const basePath = "/admin/dashboard/patients-management";

  const handleDelete = async (patient: IPatient) => {
    if (!window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      return;
    }

    try {
      await deletePatient(patient.id);
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully");
    } catch (error) {
      console.error("Failed to delete patient:", error);
      toast.error("Failed to delete patient");
    }
  };

  if (isError) {
    return <p className="text-sm text-destructive">Unable to load patients.</p>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={patients}
        columns={patientColumns}
        isLoading={isLoading}
        emptyMessage="No patients found."
        actions={{
          onView: (patient) =>
            router.push(`${basePath}/patient-details/${patient.id}`),
          onEdit: (patient) =>
            router.push(`${basePath}/patient-edit/${patient.id}`),
          onDelete: handleDelete,
        }}
      />
      <Button
        className="w-full"
        onClick={() => router.push(`${basePath}/patient-create`)}
      >
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientsTable;
