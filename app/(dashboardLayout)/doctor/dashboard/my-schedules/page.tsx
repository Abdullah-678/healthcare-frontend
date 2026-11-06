import Link from "next/link";
import { ArrowLeft, CalendarClock, Clock3 } from "lucide-react";
import { getDoctorDashboardData } from "@/services/doctor-dashboard.service";
import { getSchedules } from "@/services/schedule.service";
import AddDoctorScheduleSlot from "@/components/modules/doctor/AddDoctorScheduleSlot";

const MySchedulesPage = async () => {
  const { schedules, profile } = await getDoctorDashboardData();
  const globalSchedules = await getSchedules();
  const assignedScheduleIds = new Set(
    schedules.map((schedule) => schedule.scheduleId),
  );
  const addableSchedules = globalSchedules.success
    ? globalSchedules.data.filter(
        (schedule) =>
          new Date(schedule.startDateTime) > new Date() &&
          !assignedScheduleIds.has(schedule.id),
      )
        .sort(
          (first, second) =>
            new Date(first.startDateTime).getTime() -
            new Date(second.startDateTime).getTime(),
        )
        .slice(0, 50)
    : [];

  const availableSlots = schedules.filter((schedule) => !schedule.isBooked).length;
  const bookedSlots = schedules.length - availableSlots;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Doctor dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              My schedules
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {profile?.name ?? "Your"} availability and booking status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/doctor/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to dashboard
            </Link>
            <AddDoctorScheduleSlot schedules={addableSchedules} />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Total slots</p>
              <CalendarClock className="h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">{schedules.length}</p>
            <p className="mt-1 text-xs text-slate-500">Scheduled time blocks</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Available</p>
              <Clock3 className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">{availableSlots}</p>
            <p className="mt-1 text-xs text-slate-500">Open for patients</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Booked</p>
              <CalendarClock className="h-5 w-5 text-violet-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">{bookedSlots}</p>
            <p className="mt-1 text-xs text-slate-500">Assigned to appointments</p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Availability overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Track your open and reserved consultation slots
              </p>
              {!globalSchedules.success && (
                <p role="alert" className="mt-2 text-sm text-rose-700">
                  Could not load available slots: {globalSchedules.message}
                </p>
              )}
            </div>
          </div>

          {schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <CalendarClock className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No schedule slots yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Add consultation times to start receiving patient appointments.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
              {schedules.map((schedule) => (
                <article
                  key={schedule.scheduleId}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500">Slot ID</p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                        schedule.isBooked
                          ? "bg-violet-50 text-violet-700 ring-violet-600/20"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      }`}
                    >
                      {schedule.isBooked ? "Booked" : "Available"}
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-bold text-slate-950">
                    {new Date(schedule.schedule.startDateTime).toLocaleString()}
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">
                      {schedule.isBooked ? "Assigned to patient" : "Ready for booking"}
                    </p>
                    <p className="mt-1">
                      {schedule.isBooked
                        ? "This time block has already been reserved for an appointment."
                        : "This slot is open and can accept a new patient booking."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MySchedulesPage;
