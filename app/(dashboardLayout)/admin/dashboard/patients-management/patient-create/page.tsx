import PatientManagementForm from "@/components/modules/admin/PatientManagementForm";

const CreatePatientPage = () => (
  <section className="mx-auto max-w-4xl space-y-6">
    <header>
      <h1 className="text-2xl font-bold">Create Patient</h1>
      <p className="text-sm text-muted-foreground">
        Create a patient account with a temporary password.
      </p>
    </header>{" "}
    <PatientManagementForm />
  </section>
);

export default CreatePatientPage;
