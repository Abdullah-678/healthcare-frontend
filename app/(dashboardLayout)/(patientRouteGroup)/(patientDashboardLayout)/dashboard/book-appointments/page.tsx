"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import {
  createAppointment,
  getBookableDoctors,
  type BookableDoctor,
} from "@/services/appointment.service";

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState<BookableDoctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getBookableDoctors()
      .then((availableDoctors) => {
        if (isMounted) {
          setDoctors(availableDoctors);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setDoctorsError(
            error instanceof Error
              ? error.message
              : "Unable to load doctors. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setDoctorsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const result = await createAppointment({ doctorId });

      if (result.paymentUrl) {
        window.location.assign(result.paymentUrl);
        return;
      }

      setSuccessMessage(
        result.requestPending
          ? "Your appointment request has been sent. A time will be scheduled before payment is due."
          : "Your appointment was created. You can view it in My Appointments.",
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to create your appointment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-medium text-gray-500">Patient Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-950">
            Book an Appointment
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose a doctor to request an appointment, even if no time is
            currently available.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
              <CalendarPlus aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">
                Request an appointment
              </h2>
              <p className="text-sm text-gray-500">
                The doctor will schedule a time. You won’t be charged until
                then.
              </p>
            </div>
          </div>

          {doctorsLoading ? (
            <p role="status" className="text-sm text-gray-600">
              Loading doctors...
            </p>
          ) : doctorsError ? (
            <p role="alert" className="text-sm text-red-700">
              {doctorsError}
            </p>
          ) : doctors.length === 0 ? (
            <p className="text-sm text-gray-600">
              There are no doctors available to book right now.
            </p>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="doctorId"
                  className="text-sm font-medium text-gray-800"
                >
                  Doctor
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  required
                  value={doctorId}
                  onChange={(event) => {
                    setDoctorId(event.target.value);
                    setSuccessMessage("");
                  }}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} —{" "}
                      {doctor.specialties
                        .map(({ specialty }) => specialty.title)
                        .join(", ") || "General"}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <p className="text-sm text-gray-600">
                  Appointment fee: ৳{selectedDoctor.appointmentFee}
                </p>
              )}

              {formError && (
                <p role="alert" className="text-sm text-red-700">
                  {formError}
                </p>
              )}

              {successMessage && (
                <p role="status" className="text-sm text-green-700">
                  {successMessage}{" "}
                  <Link
                    href="/dashboard/my-appointments"
                    className="font-medium underline underline-offset-2"
                  >
                    View appointments
                  </Link>
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !doctorId || Boolean(successMessage)}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Sending request..."
                  : successMessage
                    ? "Request sent"
                    : "Request appointment"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default BookAppointmentPage;
