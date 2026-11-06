"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAppointmentPaymentStatus } from "@/services/appointment.service";

interface PaymentSuccessStatusProps {
  appointmentId?: string;
  sessionId?: string;
}

type VerificationStatus =
  | "checking"
  | "paid"
  | "pending"
  | "not-found"
  | "error"
  | "missing-reference";

const PaymentSuccessStatus = ({
  appointmentId,
  sessionId,
}: PaymentSuccessStatusProps) => {
  const [status, setStatus] = useState<VerificationStatus>(
    appointmentId ? "checking" : "missing-reference",
  );
  const [isChecking, setIsChecking] = useState(Boolean(appointmentId));
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!appointmentId) {
      return;
    }

    let active = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const checkStatus = async (attempt: number) => {
      setIsChecking(true);

      try {
        const paymentStatus = await getAppointmentPaymentStatus(
          appointmentId,
          sessionId,
        );
        if (!active) {
          return;
        }

        if (paymentStatus === "PAID") {
          setStatus("paid");
          return;
        }

        setStatus("pending");
        if (attempt < 9) {
          timeout = setTimeout(() => {
            void checkStatus(attempt + 1);
          }, 3000);
        }
      } catch (error) {
        console.error("Unable to verify appointment payment:", error);
        if (active) {
          setStatus("error");
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    };

    void checkStatus(0);

    return () => {
      active = false;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [appointmentId, retryKey, sessionId]);

  const isPaid = status === "paid";
  const isPending = status === "checking" || status === "pending";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-100 px-4 py-10">
      <section
        aria-live="polite"
        className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10"
      >
        {isPaid ? (
          <CheckCircle2
            aria-hidden="true"
            className="mx-auto h-16 w-16 text-emerald-600"
          />
        ) : isPending ? (
          <Clock3
            aria-hidden="true"
            className="mx-auto h-16 w-16 text-amber-600"
          />
        ) : (
          <AlertCircle
            aria-hidden="true"
            className="mx-auto h-16 w-16 text-amber-600"
          />
        )}

        <p className="mt-5 text-sm font-medium uppercase tracking-wide text-gray-500">
          Appointment payment
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">
          {isPaid
            ? "Payment successful"
            : isPending
              ? "Confirming your payment"
              : "Payment confirmation unavailable"}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          {isPaid
            ? "Your payment is confirmed. You can review the appointment and its latest status in My Appointments."
            : isPending
              ? "Checkout has returned successfully. We’re waiting for the payment confirmation and will check again automatically."
              : status === "not-found"
                ? "We couldn’t find this appointment in your account. Check My Appointments or contact support if your payment was charged."
                : status === "error"
                  ? "We couldn’t reach the appointment service to verify your payment. You can safely check again."
                  : "This return link is missing the appointment reference, so we can’t verify the payment yet. Check My Appointments for its status."}
        </p>

        {appointmentId && (
          <p className="mt-4 break-all text-xs text-gray-500">
            Appointment reference: {appointmentId}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {!isPaid && (
            <Button
              type="button"
              variant="outline"
              disabled={isChecking || !appointmentId}
              onClick={() => {
                setStatus("checking");
                setIsChecking(true);
                setRetryKey((current) => current + 1);
              }}
            >
              {isChecking ? "Checking..." : "Check payment status"}
            </Button>
          )}
          <Link
            href="/dashboard/my-appointments"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View my appointments
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccessStatus;
