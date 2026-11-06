import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText, Pill, UserRound } from "lucide-react";

const prescriptionData = [
  {
    id: "RX-2048",
    patientName: "Aisha Rahman",
    diagnosis: "Acute upper respiratory infection",
    medication: "Amoxicillin 500mg",
    followUpDate: "2026-11-04",
    issuedDate: "2026-10-27",
    instructions: "Take 1 capsule every 12 hours for 5 days. Finish the full course even if symptoms improve.",
    status: "Active",
  },
  {
    id: "RX-2041",
    patientName: "Nabil Hasan",
    diagnosis: "Seasonal allergy",
    medication: "Cetirizine 10mg",
    followUpDate: "2026-11-07",
    issuedDate: "2026-10-20",
    instructions: "Use once daily for 7 days. Avoid driving after the first dose if drowsiness occurs.",
    status: "Monitoring",
  },
  {
    id: "RX-2017",
    patientName: "Sadia Noor",
    diagnosis: "Migraine management",
    medication: "Sumatriptan 50mg",
    followUpDate: "2026-11-11",
    issuedDate: "2026-10-05",
    instructions: "Take at first sign of migraine and repeat only if directed by the doctor. Stay hydrated.",
    status: "Follow-up",
  },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PrescriptionsPage = () => {
  const activeCount = prescriptionData.filter(
    (prescription) => prescription.status === "Active",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Doctor dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Prescriptions
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/doctor/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to dashboard
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FileText aria-hidden="true" className="h-4 w-4" />
              New prescription
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Total issued</p>
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {prescriptionData.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">This month</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Active</p>
              <Pill className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">{activeCount}</p>
            <p className="mt-1 text-xs text-slate-500">Currently in use</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Follow-ups</p>
              <CalendarDays className="h-5 w-5 text-violet-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {prescriptionData.filter((prescription) => prescription.status !== "Active").length}
            </p>
            <p className="mt-1 text-xs text-slate-500">Pending reviews</p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent prescriptions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Medications and instructions prepared for patients
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-2">
            {prescriptionData.map((prescription) => (
              <article key={prescription.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {prescription.id}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-950">
                      {prescription.patientName}
                    </h3>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                    {prescription.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <UserRound className="h-4 w-4 text-slate-500" />
                  <span>{prescription.diagnosis}</span>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Medication
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {prescription.medication}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Instructions
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {prescription.instructions}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Issued
                    </p>
                    <p className="mt-1 font-medium text-slate-800">
                      {formatDate(prescription.issuedDate)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Follow-up
                    </p>
                    <p className="mt-1 font-medium text-slate-800">
                      {formatDate(prescription.followUpDate)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default PrescriptionsPage;
