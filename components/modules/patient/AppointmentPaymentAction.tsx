"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { initiateAppointmentPayment } from "@/services/appointment.service";

interface AppointmentPaymentActionProps {
  appointmentId: string;
}

const AppointmentPaymentAction = ({
  appointmentId,
}: AppointmentPaymentActionProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isStarting, startTransition] = useTransition();

  const handlePayment = () => {
    setErrorMessage("");

    startTransition(async () => {
      try {
        const paymentUrl = await initiateAppointmentPayment(appointmentId);
        window.location.assign(paymentUrl);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to start payment. Please try again.",
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button
        type="button"
        size="sm"
        disabled={isStarting}
        onClick={() => void handlePayment()}
      >
        {isStarting ? "Opening checkout..." : "Pay appointment fee"}
      </Button>
      {errorMessage && (
        <p role="alert" className="max-w-xs text-sm text-red-700 sm:text-right">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AppointmentPaymentAction;
