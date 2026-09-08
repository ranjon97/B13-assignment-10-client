import { useEffect, useState } from "react";
import { CalendarCheck, Heart } from "lucide-react";
import { userApi, trainerApplicationApi } from "@/api/index";
import { useAuth } from "@/context/AuthContext";
import { StatCard, RoleBadge } from "@/components/ui/Brand";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { PageSpinner } from "@/components/ui/Spinner";

export function UserOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, applicationData] = await Promise.all([
          userApi.getUserOverview(),
          trainerApplicationApi.getMine(),
        ]);
        setStats(statsData);
        setApplication(applicationData);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Overview" description="Your training snapshot at a glance." />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatCard label="Booked Classes" value={stats.totalBookedClasses} icon={CalendarCheck} />
        <StatCard label="Favorite Classes" value={stats.totalFavorites} icon={Heart} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-subtle bg-surface p-6">
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

        <div className="rounded-2xl border border-border-subtle bg-surface p-6">
          <h3 className="font-display text-lg tracking-wide text-paper">Trainer Application</h3>
          {application ? (
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full border border-border-subtle px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
                {application.status}
              </span>
              {application.status === "rejected" && application.feedback && (
                <p className="mt-3 text-sm text-muted">
                  <span className="font-medium text-paper">Admin feedback: </span>
                  {application.feedback}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">You haven't applied to become a trainer yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
