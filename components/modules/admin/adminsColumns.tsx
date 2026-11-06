import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IAdmin } from "@/types/admin.types";
import { ColumnDef } from "@tanstack/react-table";

export const adminColumns: ColumnDef<IAdmin>[] = [
  {
    accessorKey: "name",
    header: "Administrator",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.profilePhoto ?? undefined}
      />
    ),
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.user.role === "SUPERADMIN" ? "default" : "secondary"}>
        {row.original.user.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
      </Badge>
    ),
  },
  {
    id: "contactNumber",
    header: "Contact",
    cell: ({ row }) => row.original.contactNumber || "Not provided",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.user.status} />,
  },
  {
    id: "createdAt",
    header: "Joined On",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];
