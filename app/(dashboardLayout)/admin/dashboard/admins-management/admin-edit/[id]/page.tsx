import AdminManagementForm from "@/components/modules/admin/AdminManagementForm";

interface EditAdminPageProps {
  params: Promise<{ id: string }>;
}

const EditAdminPage = async ({ params }: EditAdminPageProps) => {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Edit Admin</h1>
        <p className="text-sm text-muted-foreground">
          Update administrator profile details.
        </p>
      </header>
      <AdminManagementForm adminId={id} />
    </section>
  );
};

export default EditAdminPage;
