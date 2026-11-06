import PatientManagementForm from "@/components/modules/admin/PatientManagementForm";

interface EditPatientPageProps {
  params: Promise<{ id: string }>;
}

const EditPatientPage = async ({ params }: EditPatientPageProps) => {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Edit Patient</h1>
        <p className="text-sm text-muted-foreground">
          Update patient profile details.
        </p>
      </header>
      <PatientManagementForm patientId={id} />
    </section>
  );
};

export default EditPatientPage;
