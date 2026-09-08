import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, Calendar, Users, Heart, BarChart3 } from "lucide-react";
import { classApi } from "@/api/classApi";
import { bookingApi, favoriteApi } from "@/api/bookingApi";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";

export function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isBlocked } = useAuth();

  const [fitnessClass, setFitnessClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [classData, bookingStatus, favoriteStatus] = await Promise.all([
          classApi.getClass(id),
          bookingApi.getStatus(id),
          favoriteApi.getStatus(id),
        ]);
        setFitnessClass(classData);
        setIsBooked(bookingStatus.isBooked);
        setIsFavorited(favoriteStatus.isFavorited);
      } catch (err) {
        toast.error(err.message || "Failed to load class details");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleBookNow = () => {
    if (isBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }
    if (isBooked) {
      toast.error("You have already booked this class");
      return;
    }
    navigate(`/payment/${id}`);
  };

  const handleToggleFavorite = async () => {
    setIsFavoriteLoading(true);
    try {
      if (isFavorited) {
        await favoriteApi.remove(id);
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await favoriteApi.add(id);
        setIsFavorited(true);
        toast.success("Successfully added to your favorites!");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) return <PageSpinner />;
  if (!fitnessClass) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
        <div className="h-72 w-full overflow-hidden sm:h-96">
          <img src={fitnessClass.image} alt={fitnessClass.name} className="h-full w-full object-cover" />
        </div>

        <div className="p-6 sm:p-10">
          <span className="font-mono text-xs uppercase tracking-widest text-pulse">
            {fitnessClass.category} · {fitnessClass.difficultyLevel}
          </span>
          <h1 className="mt-2 font-display text-4xl tracking-wide text-paper">{fitnessClass.name}</h1>
          <p className="mt-2 text-sm text-muted">Trainer: {fitnessClass.trainer?.name}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-border-subtle p-4">
              <Clock size={16} className="text-pulse" />
              <p className="mt-2 text-xs text-muted">Duration</p>
              <p className="text-sm font-semibold text-paper">{fitnessClass.duration}</p>
            </div>
            <div className="rounded-xl border border-border-subtle p-4">
              <Calendar size={16} className="text-pulse" />
              <p className="mt-2 text-xs text-muted">Schedule</p>
              <p className="text-sm font-semibold text-paper">{fitnessClass.schedule}</p>
            </div>
            <div className="rounded-xl border border-border-subtle p-4">
              <Users size={16} className="text-pulse" />
              <p className="mt-2 text-xs text-muted">Booked</p>
              <p className="text-sm font-semibold text-paper">{fitnessClass.bookingCount || 0}</p>
            </div>
            <div className="rounded-xl border border-border-subtle p-4">
              <BarChart3 size={16} className="text-pulse" />
              <p className="mt-2 text-xs text-muted">Level</p>
              <p className="text-sm font-semibold capitalize text-paper">{fitnessClass.difficultyLevel}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-lg tracking-wide text-paper">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{fitnessClass.description}</p>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-border-subtle pt-6 sm:flex-row sm:items-center">
            <span className="font-display text-4xl text-pulse">{formatCurrency(fitnessClass.price)}</span>
            <div className="flex w-full gap-3 sm:w-auto">
              <Button
                variant="secondary"
                onClick={handleToggleFavorite}
                isLoading={isFavoriteLoading}
                className="flex-1 sm:flex-none"
              >
                <Heart size={16} className={isFavorited ? "fill-pulse text-pulse" : ""} />
                {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
              </Button>
              <Button
                onClick={handleBookNow}
                disabled={isBooked}
                className="flex-1 sm:flex-none"
              >
                {isBooked ? "Already Booked" : "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
