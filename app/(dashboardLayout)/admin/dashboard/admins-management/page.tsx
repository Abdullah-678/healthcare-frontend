import AdminsTable from "@/components/modules/admin/AdminsTable";
import { getUserInfo } from "@/services/auth.service";
import { getAdmins } from "@/services/admin.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

const AdminManagementPage = async () => {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
    staleTime: 60 * 1000,
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage administrator accounts.
        </p>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminsTable canManage={userInfo.role === "SUPERADMIN"} />
      </HydrationBoundary>
    </section>
  );
};

export default AdminManagementPage;
