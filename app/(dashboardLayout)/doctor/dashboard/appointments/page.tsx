import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { getDoctorDashboardData } from "@/services/doctor-dashboard.service";
import AppointmentStatusAction from "@/components/modules/doctor/AppointmentStatusAction";
import AppointmentPrescriptionAction from "@/components/modules/doctor/AppointmentPrescriptionAction";
import ScheduleAppointmentAction from "@/components/modules/doctor/ScheduleAppointmentAction";

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTimeRange = (start: string, end: string) => {
  const startTime = new Date(start).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = new Date(end).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
};

const statusStyles: Record<string, string> = {
  REQUESTED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SCHEDULED: "bg-blue-50 text-blue-700 ring-blue-600/20",
  INPROGRESS: "bg-violet-50 text-violet-700 ring-violet-600/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELED: "bg-slate-100 text-slate-600 ring-slate-400/20",
};

const paymentStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  UNPAID: "bg-rose-50 text-rose-700 ring-rose-600/20",
  REFUNDED: "bg-slate-100 text-slate-700 ring-slate-400/20",
};

const AppointmentPage = async () => {
  const { appointments, schedules } = await getDoctorDashboardData();

  const validAppointments = appointments.filter(
    (appointment) => appointment && typeof appointment === "object",
  );

  const sortedAppointments = [...validAppointments].sort((first, second) => {
    const firstTimestamp = first.schedule
      ? new Date(first.schedule.startDateTime).getTime()
      : new Date(first.createdAt).getTime();
    const secondTimestamp = second.schedule
      ? new Date(second.schedule.startDateTime).getTime()
      : new Date(second.createdAt).getTime();

    return secondTimestamp - firstTimestamp;
  });

  const requestedCount = sortedAppointments.filter(
    (appointment) => appointment.status === "REQUESTED",
  ).length;
  const scheduledCount = sortedAppointments.filter((appointment) =>
    ["SCHEDULED", "INPROGRESS"].includes(appointment.status),
  ).length;
  const completedCount = sortedAppointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;
  const availableSchedules = schedules.filter(
    (schedule) =>
      !schedule.isBooked &&
      new Date(schedule.schedule.startDateTime) > new Date(),
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Doctor dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Appointments
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
            <Link
              href="/doctor/dashboard/my-schedules"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Manage schedules
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Total</p>
              <CalendarDays className="h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {sortedAppointments.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">Appointments recorded</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Requested</p>
              <UserRound className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {requestedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">Awaiting scheduling</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">
                Scheduled / in progress
              </p>
              <Clock3 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {scheduledCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Confirmed and active visits
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {completedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">Finished consultations</p>
          </article>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Patient appointments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review upcoming and past consultations
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {sortedAppointments.length} total
            </span>
          </div>

          {sortedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <CalendarDays className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No appointments yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Patient appointments will appear here once they are requested or scheduled.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                          Appointment #{appointment.id.slice(0, 8)}
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-slate-950">
                          {appointment.patient.name}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[appointment.status] ?? "bg-slate-100 text-slate-700 ring-slate-300"}`}
                      >
                        {formatStatus(appointment.status)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Date
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {appointment.schedule
                              ? formatDate(appointment.schedule.startDateTime)
                              : "Awaiting schedule"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Time
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {appointment.schedule
                              ? formatTimeRange(
                                  appointment.schedule.startDateTime,
                                  appointment.schedule.endDateTime,
                                )
                              : "Pending assignment"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Payment
                          </p>
                          <span
                            className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${paymentStyles[appointment.paymentStatus] ?? "bg-slate-100 text-slate-700 ring-slate-300"}`}
                          >
                            {formatStatus(appointment.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Stethoscope className="h-4 w-4 text-slate-500" />
                      Consultation
                    </div>
                    {appointment.status === "REQUESTED" &&
                      (availableSchedules.length > 0 ? (
                        <ScheduleAppointmentAction
                          appointmentId={appointment.id}
                          schedules={availableSchedules}
                        />
                      ) : (
                        <p className="max-w-xs text-right text-xs text-amber-700">
                          Add an available time slot in{" "}
                          <Link
                            className="font-semibold underline"
                            href="/doctor/dashboard/my-schedules"
                          >
                            My Schedules
                          </Link>{" "}
                          before scheduling this request.
                        </p>
                      ))}
                    {appointment.status === "SCHEDULED" && (
                      <AppointmentStatusAction
                        appointmentId={appointment.id}
                        nextStatus="INPROGRESS"
                      />
                    )}
                    {appointment.status === "INPROGRESS" && (
                      <AppointmentStatusAction
                        appointmentId={appointment.id}
                        nextStatus="COMPLETED"
                      />
                    )}
                    {appointment.status === "COMPLETED" &&
                      appointment.paymentStatus === "PAID" && (
                        <AppointmentPrescriptionAction
                          appointmentId={appointment.id}
                        />
                      )}
                    {appointment.status === "COMPLETED" &&
                      appointment.paymentStatus !== "PAID" && (
                        <p className="max-w-xs text-right text-xs text-amber-700">
                          Prescription is available after payment is confirmed.
                        </p>
                      )}
                    <p className="text-sm text-slate-500">
                      Created {formatDate(appointment.createdAt)}
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

export default AppointmentPage;
