import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { bookingApi } from "@/api/bookingApi";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const [booking, setBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("Missing payment session reference.");
      return;
    }

    async function confirm() {
      try {
        const confirmedBooking = await bookingApi.confirmBooking(sessionId);
        setBooking(confirmedBooking);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.message || "We couldn't confirm your payment.");
      }
    }
    confirm();
  }, [sessionId]);

  if (status === "loading") return <PageSpinner />;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      {status === "success" ? (
        <>
          <CheckCircle2 size={48} className="text-pulse" />
          <h1 className="mt-4 font-display text-3xl tracking-wide text-paper">Booking Confirmed!</h1>
          <p className="mt-2 text-sm text-muted">
            You're booked into {booking?.fitnessClass?.name}. See you at the next session.
          </p>
          <Link to="/dashboard/bookings">
            <Button className="mt-8">View My Bookings</Button>
          </Link>
        </>
      ) : (
        <>
          <XCircle size={48} className="text-signal" />
          <h1 className="mt-4 font-display text-3xl tracking-wide text-paper">Something Went Wrong</h1>
          <p className="mt-2 text-sm text-muted">{errorMessage}</p>
          <Link to="/classes">
            <Button variant="secondary" className="mt-8">Back to Classes</Button>
          </Link>
        </>
      )}
    </div>
  );
}
