import AccountDetail from "@/components/modules/admin/AccountDetail";
import { getPatientById } from "@/services/patient.service";

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

const PatientDetailsPage = async ({ params }: PatientDetailsPageProps) => {
  const { id } = await params;
  const { data } = await getPatientById(id);
  const baseHref = "/admin/dashboard/patients-management";

  return (
    <AccountDetail
      id={data.id}
      name={data.name}
      email={data.email}
      profilePhoto={data.profilePhoto}
      contactNumber={data.contactNumber}
      address={data.address}
      role="Patient"
      status={data.user.status}
      createdAt={data.createdAt}
      backHref={baseHref}
      editHref={`${baseHref}/patient-edit/${data.id}`}
    />
  );
};

export default PatientDetailsPage;
