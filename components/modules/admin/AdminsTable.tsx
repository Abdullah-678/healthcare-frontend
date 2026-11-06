"use client";

import DataTable from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { deleteAdmin, getAdmins } from "@/services/admin.service";
import { IAdmin } from "@/types/admin.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminColumns } from "./adminsColumns";

interface AdminsTableProps {
  canManage: boolean;
}

const AdminsTable = ({ canManage }: AdminsTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });

  const admins = data?.data ?? [];
  const basePath = "/admin/dashboard/admins-management";

  const handleDelete = async (admin: IAdmin) => {
    if (!window.confirm(`Are you sure you want to delete ${admin.name}?`)) {
      return;
    }

    try {
      await deleteAdmin(admin.id);
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deleted successfully");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin");
    }
  };

  if (isError) {
    return <p className="text-sm text-destructive">Unable to load admins.</p>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={admins}
        columns={adminColumns}
        isLoading={isLoading}
        emptyMessage="No admins found."
        actions={{
          onView: (admin) => router.push(`${basePath}/admin-details/${admin.id}`),
          ...(canManage
            ? {
                onEdit: (admin: IAdmin) =>
                  router.push(`${basePath}/admin-edit/${admin.id}`),
                onDelete: handleDelete,
              }
            : {}),
        }}
      />
      {canManage && (
        <Button
          className="w-full"
          onClick={() => router.push(`${basePath}/admin-create`)}
        >
          Add New Admin
        </Button>
      )}
    </div>
  );
};

export default AdminsTable;
