import { CalendarDays, FileText, Stethoscope } from "lucide-react";
import { getMyPatientRecords } from "@/services/patient-record.service";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const MyPrescriptionsPage = async () => {
  const { patient } = await getMyPatientRecords();
  const prescriptions = patient?.prescriptions ?? [];

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-medium text-gray-500">Patient Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-950">
            My Prescriptions
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review your doctors’ instructions and follow-up dates.
          </p>
        </header>

        {prescriptions.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <FileText
              aria-hidden="true"
              className="mx-auto h-10 w-10 text-gray-400"
            />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No prescriptions yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Prescriptions from your doctor will appear here.
            </p>
          </section>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {prescriptions.map((prescription) => (
              <li
                key={prescription.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
                    <FileText aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-950">
                      Prescription
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Issued {formatDate(prescription.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-gray-500"
                  />
                  <span>Prescribed by your doctor</span>
                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Instructions
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {prescription.instructions}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <CalendarDays
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-gray-500"
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Follow-up date
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(prescription.followUpDate)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default MyPrescriptionsPage;
