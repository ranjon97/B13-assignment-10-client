import { useEffect, useState } from "react";
import { Dumbbell, Users } from "lucide-react";
import { userApi } from "@/api/index";
import { useAuth } from "@/context/AuthContext";
import { StatCard, RoleBadge } from "@/components/ui/Brand";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { PageSpinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/States";

export function TrainerOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    userApi
      .getTrainerOverview()
      .then(setStats)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageSpinner />;
  if (hasError || !stats) return <ErrorState message="We couldn't load your stats right now." />;

  return (
    <div>
      <DashboardHeader title="Overview" description="Your coaching impact so far." />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatCard label="Classes Created" value={stats.totalClassesCreated} icon={Dumbbell} />
        <StatCard label="Students Enrolled" value={stats.totalStudentsEnrolled} icon={Users} />
      </div>

      <div className="mt-8 max-w-md rounded-2xl border border-border-subtle bg-surface p-6">
        <h3 className="font-display text-lg tracking-wide text-paper">Profile</h3>
        <div className="mt-4 flex items-center gap-4">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-paper">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <div className="mt-2"><RoleBadge role={user.role} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
