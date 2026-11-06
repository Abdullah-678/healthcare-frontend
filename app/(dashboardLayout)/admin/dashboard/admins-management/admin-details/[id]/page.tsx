import AccountDetail from "@/components/modules/admin/AccountDetail";
import { getAdminById } from "@/services/admin.service";
import { getUserInfo } from "@/services/auth.service";
import { redirect } from "next/navigation";

interface AdminDetailsPageProps {
  params: Promise<{ id: string }>;
}

const AdminDetailsPage = async ({ params }: AdminDetailsPageProps) => {
  const [{ id }, userInfo] = await Promise.all([params, getUserInfo()]);
  if (!userInfo) redirect("/login");

  const { data } = await getAdminById(id);
  const baseHref = "/admin/dashboard/admins-management";

  return (
    <AccountDetail
      id={data.id}
      name={data.name}
      email={data.email}
      profilePhoto={data.profilePhoto}
      contactNumber={data.contactNumber}
      role={data.user.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
      status={data.user.status}
      createdAt={data.createdAt}
      backHref={baseHref}
      editHref={
        userInfo.role === "SUPERADMIN"
          ? `${baseHref}/admin-edit/${data.id}`
          : undefined
      }
    />
  );
};

export default AdminDetailsPage;
