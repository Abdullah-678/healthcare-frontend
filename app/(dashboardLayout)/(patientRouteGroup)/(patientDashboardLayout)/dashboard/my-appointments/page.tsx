import { CalendarDays, Clock3, Stethoscope } from "lucide-react";
import { getMyAppointments } from "@/services/appointment.service";

const MyAppointmentPage = async () => {
  const appointments = await getMyAppointments();

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-medium text-gray-500">Patient Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-950">
            My Appointments
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View your appointment requests and scheduled consultations.
          </p>
        </header>

        {appointments.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <CalendarDays className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No appointments yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your scheduled appointments will appear here.
            </p>
          </section>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Appointment #{appointment.id}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gray-950">
                      {appointment.doctor.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {appointment.doctor.specialization}
                    </p>
                  </div>
                  <p className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                    ৳{appointment.doctor.appointmentFee}
                  </p>
                </div>

                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  {appointment.schedule ? (
                    <>
                      <div className="flex items-start gap-3">
                        <CalendarDays
                          aria-hidden="true"
                          className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                        />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Date
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {new Date(
                              appointment.schedule.startDateTime,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock3
                          aria-hidden="true"
                          className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                        />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Time
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {new Date(
                              appointment.schedule.startDateTime,
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(
                              appointment.schedule.endDateTime,
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-amber-700 sm:col-span-2">
                      Appointment requested — waiting for a time to be
                      scheduled.
                    </p>
                  )}

                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Stethoscope
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-gray-500"
                    />
                    <p className="text-sm text-gray-600">
                      Consultation with {appointment.doctor.name}
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

export default MyAppointmentPage;
