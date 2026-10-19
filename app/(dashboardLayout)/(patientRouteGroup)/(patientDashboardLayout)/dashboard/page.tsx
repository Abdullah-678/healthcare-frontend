"use client";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";

const PatientDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-black p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Patient Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Good morning
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Here’s an overview of your health, appointments, prescriptions,
                and medical reports.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-black">
              <UserRound className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <CalendarDays className="h-6 w-6" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Upcoming
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-black">2</p>
            <p className="mt-1 text-sm text-gray-500">Appointments</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <Stethoscope className="h-6 w-6" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Connected
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-black">3</p>
            <p className="mt-1 text-sm text-gray-500">My Doctors</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <Pill className="h-6 w-6" />
              </div>

              <span className="text-xs font-medium text-gray-400">Active</span>
            </div>

            <p className="mt-5 text-3xl font-bold text-black">4</p>
            <p className="mt-1 text-sm text-gray-500">Prescriptions</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <FileText className="h-6 w-6" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                Available
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-black">6</p>
            <p className="mt-1 text-sm text-gray-500">Medical Reports</p>
          </div>
        </div>

        {/* Appointment + Health Overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Upcoming Appointment */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Upcoming Appointment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your next scheduled appointment
                </p>
              </div>

              <CalendarDays className="h-6 w-6 text-black" />
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                  <Stethoscope className="h-9 w-9" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400">
                    Cardiologist
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-black">
                    Dr. John Doe
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-black" />
                      October 22, 2026
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-black" />
                      10:30 AM
                    </span>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Health Overview */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-black">Health Overview</h2>
                  <p className="text-xs text-gray-500">Latest measurements</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between p-5">
                <span className="text-sm text-gray-500">Blood Pressure</span>
                <span className="font-bold text-black">120/80</span>
              </div>

              <div className="flex items-center justify-between p-5">
                <span className="text-sm text-gray-500">Heart Rate</span>
                <span className="font-bold text-black">72 bpm</span>
              </div>

              <div className="flex items-center justify-between p-5">
                <span className="text-sm text-gray-500">Weight</span>
                <span className="font-bold text-black">68 kg</span>
              </div>

              <div className="flex items-center justify-between p-5">
                <span className="text-sm text-gray-500">Blood Glucose</span>
                <span className="font-bold text-black">95 mg/dL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions + Reports */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Prescriptions */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Recent Prescriptions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest medicines
                </p>
              </div>

              <Pill className="h-6 w-6 text-black" />
            </div>

            <div className="divide-y divide-gray-100">
              {[
                ["Paracetamol", "500mg", "Active"],
                ["Omeprazole", "20mg", "Active"],
                ["Amoxicillin", "500mg", "Completed"],
              ].map(([name, dosage, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-5"
                >
                  <div>
                    <h3 className="font-semibold text-black">{name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{dosage}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      status === "Active"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>

            <button className="flex w-full items-center justify-center gap-2 border-t border-gray-100 p-4 text-sm font-semibold text-black transition hover:bg-gray-50">
              View All Prescriptions
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Medical Reports */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Medical Reports
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your recent diagnostic reports
                </p>
              </div>

              <FileText className="h-6 w-6 text-black" />
            </div>

            <div className="divide-y divide-gray-100">
              {[
                ["Complete Blood Count", "Oct 15, 2026"],
                ["Lipid Profile", "Oct 10, 2026"],
                ["Blood Glucose", "Oct 05, 2026"],
              ].map(([report, date]) => (
                <div
                  key={report}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-black">
                        {report}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{date}</p>
                    </div>
                  </div>

                  <button className="text-sm font-semibold text-black hover:underline">
                    View
                  </button>
                </div>
              ))}
            </div>

            <button className="flex w-full items-center justify-center gap-2 border-t border-gray-100 p-4 text-sm font-semibold text-black transition hover:bg-gray-50">
              View All Reports
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-black">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Quickly access your healthcare services
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              {
                name: "Appointments",
                icon: CalendarDays,
              },
              {
                name: "Doctors",
                icon: Stethoscope,
              },
              {
                name: "Diagnostics",
                icon: Activity,
              },
              {
                name: "Medicines",
                icon: Pill,
              },
              {
                name: "Health Plans",
                icon: HeartPulse,
              },
              {
                name: "NGOs",
                icon: UserRound,
              },
            ].map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.name}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-black hover:shadow-md"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white transition group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-black">
                    {action.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Health Tips */}
        <div className="rounded-2xl bg-black p-7 text-white shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-black">
              <Activity className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Health Tip</h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Stay hydrated, maintain a balanced diet, exercise regularly, and
                keep up with your scheduled health checkups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
