import {
  Activity,
  CalendarDays,
  FileText,
  HeartPulse,
  Ruler,
  Weight,
} from "lucide-react";
import { getMyPatientRecords } from "@/services/patient-record.service";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const HealthRecordsPage = async () => {
  const { patient } = await getMyPatientRecords();
  const healthData = patient?.patientHealthData ?? null;
  const medicalReports = patient?.medicalReports ?? [];

  const healthDetails = healthData
    ? [
        ["Gender", formatLabel(healthData.gender)],
        ["Date of birth", formatDate(healthData.dateOfBirth)],
        ["Blood group", formatLabel(healthData.bloodGroup)],
        ["Allergies", healthData.hasAllergies ? "Reported" : "None reported"],
        ["Diabetes", healthData.hasDiabetes ? "Reported" : "Not reported"],
        ["Smoking", healthData.smokingStatus ? "Yes" : "No"],
        ["Past surgeries", healthData.hasPastSurgeries ? "Yes" : "No"],
        ["Pregnancy", healthData.pregnancyStatus ? "Yes" : "No"],
        ["Recent anxiety", healthData.recentAnxiety ? "Reported" : "Not reported"],
        [
          "Recent depression",
          healthData.recentDepression ? "Reported" : "Not reported",
        ],
        ["Dietary preferences", healthData.dietaryPreferences || "Not provided"],
        [
          "Mental health history",
          healthData.mentalHealthHistory || "Not provided",
        ],
        [
          "Immunization status",
          healthData.immunizationStatus || "Not provided",
        ],
        ["Marital status", healthData.maritalStatus || "Not provided"],
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-medium text-gray-500">Patient Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-950">
            Health Records
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View your health profile and medical reports in one place.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
              <HeartPulse aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">
                Health profile
              </h2>
              <p className="text-sm text-gray-500">
                {healthData
                  ? `Last updated ${formatDate(healthData.updatedAt)}`
                  : "Your personal health information"}
              </p>
            </div>
          </div>

          {healthData ? (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Ruler
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-500"
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Height
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {healthData.height}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <Weight
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-500"
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Weight
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {healthData.weight}
                    </p>
                  </div>
                </div>
              </div>
              <dl className="mt-6 grid gap-x-8 gap-y-5 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {healthDetails.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <div className="mt-6 rounded-xl bg-gray-50 px-5 py-8 text-center">
              <Activity
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-gray-400"
              />
              <p className="mt-3 text-sm text-gray-600">
                Your health profile has not been added yet.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
              <FileText aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">
                Medical reports
              </h2>
              <p className="text-sm text-gray-500">
                Uploaded reports and documents
              </p>
            </div>
          </div>

          {medicalReports.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 px-5 py-8 text-center">
              <CalendarDays
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-gray-400"
              />
              <p className="mt-3 text-sm text-gray-600">
                No medical reports have been added yet.
              </p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-gray-100">
              {medicalReports.map((report) => (
                <li
                  key={report.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {report.reportName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Added {formatDate(report.createdAt)}
                    </p>
                  </div>
                  <a
                    href={report.reportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-fit items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                  >
                    View report
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default HealthRecordsPage;
