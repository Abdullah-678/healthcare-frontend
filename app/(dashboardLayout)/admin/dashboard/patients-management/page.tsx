import PatientsTable from "@/components/modules/admin/PatientsTable";
import { getPatients } from "@/services/patient.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const PatientsManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
    staleTime: 60 * 1000,
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Patient Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage patient accounts.
        </p>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PatientsTable />
      </HydrationBoundary>
    </section>
  );
};

export default PatientsManagementPage;
