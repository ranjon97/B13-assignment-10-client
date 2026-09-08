import { useAuth } from "@/context/AuthContext";
import { UserOverview } from "./user/UserOverview";
import { TrainerOverview } from "./trainer/TrainerOverview";
import { AdminOverview } from "./admin/AdminOverview";

export function DashboardOverviewPage() {
  const { role } = useAuth();

  if (role === "admin") return <AdminOverview />;
  if (role === "trainer") return <TrainerOverview />;
  return <UserOverview />;
}
