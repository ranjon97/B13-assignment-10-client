import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { bookingApi } from "@/api/bookingApi";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";

export function BookedClassesPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingApi.getMyBookings().then(setBookings).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Booked Classes" description="Classes you've successfully registered for." />

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Browse classes and book your first session."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Trainer</th>
                <th className="px-5 py-3">Schedule</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-5 py-4 font-medium text-paper">{booking.fitnessClass?.name}</td>
                  <td className="px-5 py-4 text-muted">{booking.fitnessClass?.trainer?.name}</td>
                  <td className="px-5 py-4 text-muted">{booking.fitnessClass?.schedule}</td>
                  <td className="px-5 py-4 text-paper">{formatCurrency(booking.price)}</td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/classes/${booking.fitnessClass?._id}`}
                      className="font-medium text-pulse hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
