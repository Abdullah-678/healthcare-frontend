import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { IPatient } from "@/types/patient.types";
import { ColumnDef } from "@tanstack/react-table";

export const patientColumns: ColumnDef<IPatient>[] = [
  {
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.profilePhoto ?? undefined}
      />
    ),
  },
  {
    id: "contactNumber",
    header: "Contact",
    cell: ({ row }) => row.original.contactNumber || "Not provided",
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => row.original.address || "Not provided",
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
