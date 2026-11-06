import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  FileText,
  Star,
} from "lucide-react";
import { getDoctorDashboardData } from "@/services/doctor-dashboard.service";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const statusStyles: Record<string, string> = {
  REQUESTED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SCHEDULED: "bg-blue-50 text-blue-700 ring-blue-600/20",
  INPROGRESS: "bg-violet-50 text-violet-700 ring-violet-600/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELED: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

const DoctorDashboard = async () => {
  const {
    profile,
    appointments: appointmentData,
    reviews,
    schedules,
  } = await getDoctorDashboardData();
  const appointments = appointmentData.filter((appointment) => {
    if (appointment && typeof appointment === "object") {
      return true;
    }

    console.error("Ignoring an invalid appointment in doctor dashboard data");
    return false;
  });
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const todayAppointments = appointments.filter((appointment) => {
    if (!appointment?.schedule) return false;
    const appointmentDate = new Date(appointment.schedule.startDateTime);
    return appointmentDate >= todayStart && appointmentDate < tomorrowStart;
  });
  const pendingRequests = appointments.filter(
    (appointment) => appointment?.status === "REQUESTED",
  ).length;
  const upcomingAppointments = appointments
    .filter((appointment) => {
      if (!appointment?.schedule) return false;
      return (
        new Date(appointment.schedule.startDateTime) >= now &&
        ["SCHEDULED", "INPROGRESS"].includes(appointment.status)
      );
    })
    .sort(
      (first, second) =>
        new Date(first.schedule!.startDateTime).getTime() -
        new Date(second.schedule!.startDateTime).getTime(),
    )
    .slice(0, 5);

  const availableSchedules = schedules.filter(
    (schedule) => !schedule.isBooked,
  ).length;
  const specialtyNames = (profile?.specialties ?? [])
    .map((doctorSpecialty) => doctorSpecialty?.specialty?.title)
    .filter((title): title is string => Boolean(title?.trim()))
    .join(", ");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-900 px-6 py-8 text-white shadow-sm sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-teal-200">
                Doctor workspace
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome, {profile?.name ?? "Doctor"}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {profile?.designation || "Your practice at a glance"}
                {specialtyNames ? ` · ${specialtyNames}` : ""}
              </p>
            </div>
            <Link
              href="/doctor/dashboard/appointments"
              className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-50"
            >
              View appointments
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section
          aria-label="Practice overview"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">
                Total appointments
              </p>
              <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                <CalendarDays aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {appointments.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {pendingRequests} awaiting scheduling
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">
                Today&apos;s appointments
              </p>
              <span className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                <CalendarCheck2 aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {todayAppointments.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">Scheduled for today</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">
                Available slots
              </p>
              <span className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                <Clock3 aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {availableSchedules}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {schedules.length - availableSchedules} slots booked
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">
                Patient rating
              </p>
              <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                <Star aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {Number(profile?.averageRating ?? 0).toFixed(1)}
              <span className="ml-1 text-base font-medium text-slate-400">
                / 5
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Based on {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </article>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Upcoming appointments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your next scheduled patient visits
                </p>
              </div>
              <Link
                href="/doctor/dashboard/appointments"
                className="shrink-0 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                All appointments
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CalendarDays
                  aria-hidden="true"
                  className="mx-auto h-9 w-9 text-slate-300"
                />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  No upcoming appointments
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  New scheduled patient visits will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {upcomingAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-800">
                        {appointment.patient.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {appointment.patient.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(appointment.schedule!.startDateTime)} ·{" "}
                          {formatTime(appointment.schedule!.startDateTime)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[appointment.status] ??
                        "bg-gray-100 text-gray-600 ring-gray-500/20"
                      }`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                <Star aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Recent feedback
                </h2>
                <p className="text-sm text-slate-500">Latest patient reviews</p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No reviews yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Patient feedback will appear here.
                </p>
              </div>
            ) : (
              <ul className="mt-5 space-y-4">
                {[...reviews]
                  .sort(
                    (first, second) =>
                      new Date(second.createdAt).getTime() -
                      new Date(first.createdAt).getTime(),
                  )
                  .slice(0, 3)
                  .map((review) => (
                    <li
                      key={review.id}
                      className="border-t border-slate-100 pt-4 first:border-0 first:pt-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {review.patient.name}
                        </p>
                        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-700">
                          <Star
                            aria-hidden="true"
                            className="h-4 w-4 fill-current"
                          />
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">
                        {review.comment || "No written comment."}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
            <Link
              href="/doctor/dashboard/my-reviews"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View all reviews
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </section>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/doctor/dashboard/my-schedules"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <Clock3 aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-950">Manage schedule</p>
                <p className="mt-1 text-sm text-slate-500">
                  {schedules.length} assigned availability slots
                </p>
              </div>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700"
            />
          </Link>

          <Link
            href="/doctor/dashboard/prescriptions"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="rounded-xl bg-violet-50 p-3 text-violet-700">
                <FileText aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-950">Prescriptions</p>
                <p className="mt-1 text-sm text-slate-500">
                  Create and manage patient prescriptions
                </p>
              </div>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700"
            />
          </Link>
        </section>
      </div>
    </main>
  );
};

export default DoctorDashboard;
