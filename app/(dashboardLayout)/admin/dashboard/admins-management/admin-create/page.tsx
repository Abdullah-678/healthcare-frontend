import AdminManagementForm from "@/components/modules/admin/AdminManagementForm";

const CreateAdminPage = () => (
  <section className="mx-auto max-w-4xl space-y-6">
    <header>
      <h1 className="text-2xl font-bold">Create Admin</h1>
      <p className="text-sm text-muted-foreground">
        Create an administrator account. The admin will change the temporary password after signing in.
      </p>
    </header>
    <AdminManagementForm />
  </section>
);

export default CreateAdminPage;
