import DoctorsTable from "@/components/modules/admin/DoctorsTable";
import { getDoctors } from "@/services/doctor.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const DoctorsManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
    staleTime: 60 * 1000,
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage doctor accounts.
        </p>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DoctorsTable />
      </HydrationBoundary>
    </section>
  );
};

export default DoctorsManagementPage;
