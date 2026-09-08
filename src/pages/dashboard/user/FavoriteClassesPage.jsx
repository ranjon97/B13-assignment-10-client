import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heart, Trash2 } from "lucide-react";
import { favoriteApi } from "@/api/bookingApi";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";

export function FavoriteClassesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = () => favoriteApi.getMine().then(setFavorites).finally(() => setIsLoading(false));

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (classId) => {
    try {
      await favoriteApi.remove(classId);
      setFavorites((prev) => prev.filter((f) => f.fitnessClass?._id !== classId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Favorite Classes" description="Classes you've saved for later." />

      {favorites.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" description="Save classes you're interested in." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <div
              key={favorite._id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-paper">{favorite.fitnessClass?.name}</p>
                <p className="text-sm text-muted">{favorite.fitnessClass?.trainer?.name}</p>
                <p className="mt-1 text-sm text-pulse">{formatCurrency(favorite.fitnessClass?.price)}</p>
              </div>
              <button
                onClick={() => handleRemove(favorite.fitnessClass?._id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-subtle text-muted hover:border-signal hover:text-signal"
                aria-label="Remove favorite"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
