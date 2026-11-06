"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DataTable from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { deleteDoctor, getDoctors } from "@/services/doctor.service";
import { IDoctor } from "@/types/doctor.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorColumns } from "./doctorsColumns";

const DoctorsTable = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: doctorDataResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const doctors = doctorDataResponse?.data ?? [];

  const handleView = (doctor: IDoctor) => {
    router.push(
      `/admin/dashboard/doctors-management/doctor-details/${doctor.id}`,
    );
  };

  const handleEdit = (doctor: IDoctor) => {
    router.push(`/admin/dashboard/doctors-management/doctor-edit/${doctor.id}`);
  };

  const handleDelete = async (doctor: IDoctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}?`,
    );

    if (!confirmed) return;

    try {
      await deleteDoctor(doctor.id.toString());
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor deleted successfully");
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      toast.error("Failed to delete doctor");
    }
  };

  if (isError) {
    return <p className="text-sm text-destructive">Unable to load doctors.</p>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={doctors}
        columns={doctorColumns}
        isLoading={isLoading}
        emptyMessage="No doctors found."
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      <Button
        className="w-full"
        onClick={() =>
          router.push("/admin/dashboard/doctors-management/doctor-create")
        }
      >
        Add New Doctor
      </Button>
    </div>
  );
};

export default DoctorsTable;
