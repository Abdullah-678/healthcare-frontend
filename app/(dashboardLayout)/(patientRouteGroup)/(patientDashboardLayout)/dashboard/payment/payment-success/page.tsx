import PaymentSuccessStatus from "@/components/modules/patient/PaymentSuccessStatus";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    appointment_id?: string | string[];
    session_id?: string | string[];
  }>;
}

const PaymentSuccessPage = async ({
  searchParams,
}: PaymentSuccessPageProps) => {
  const {
    appointment_id: appointmentIdParam,
    session_id: sessionIdParam,
  } = await searchParams;
  const appointmentId = Array.isArray(appointmentIdParam)
    ? appointmentIdParam[0]
    : appointmentIdParam;
  const sessionId = Array.isArray(sessionIdParam)
    ? sessionIdParam[0]
    : sessionIdParam;

  return (
    <PaymentSuccessStatus
      appointmentId={appointmentId}
      sessionId={sessionId}
    />
  );
};

export default PaymentSuccessPage;
