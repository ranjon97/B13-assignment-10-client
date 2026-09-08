import { useEffect, useState } from "react";
import { Users, Dumbbell, CalendarCheck } from "lucide-react";
import { userApi } from "@/api/index";
import { useAuth } from "@/context/AuthContext";
import { StatCard, RoleBadge } from "@/components/ui/Brand";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { PageSpinner } from "@/components/ui/Spinner";

export function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    userApi.getAdminOverview().then(setStats);
  }, []);

  if (!stats) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Overview" description="Platform-wide statistics." />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Total Classes" value={stats.totalClasses} icon={Dumbbell} />
        <StatCard label="Total Booked Classes" value={stats.totalBookedClasses} icon={CalendarCheck} />
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
