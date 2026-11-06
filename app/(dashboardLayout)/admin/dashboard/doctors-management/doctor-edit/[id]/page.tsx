import DoctorManagementForm from "@/components/modules/admin/DoctorManagementForm";

interface EditDoctorPageProps {
  params: Promise<{ id: string }>;
}

const EditDoctorPage = async ({ params }: EditDoctorPageProps) => {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Edit Doctor</h1>
        <p className="text-sm text-muted-foreground">
          Update the doctor&apos;s account and professional information.
        </p>
      </header>
      <DoctorManagementForm doctorId={id} />
    </section>
  );
};

export default EditDoctorPage;
