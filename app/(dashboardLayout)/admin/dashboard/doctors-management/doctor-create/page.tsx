import DoctorManagementForm from "@/components/modules/admin/DoctorManagementForm";

const CreateDoctorPage = () => (
  <section className="mx-auto max-w-4xl space-y-6">
    <header>
      <h1 className="text-2xl font-bold">Create Doctor</h1>
      <p className="text-sm text-muted-foreground">
        Create a doctor account with a temporary password.
      </p>
    </header>
    <DoctorManagementForm />
  </section>
);

export default CreateDoctorPage;
