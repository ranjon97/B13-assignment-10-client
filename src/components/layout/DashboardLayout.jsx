import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RoleBadge } from "@/components/ui/Brand";
import { dashboardNav } from "@/constants/dashboardNav";

export function DashboardLayout() {
  const { user, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navItems = dashboardNav[role] || [];

  return (
    <div className="flex min-h-screen bg-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-border-subtle bg-surface transition-transform lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border-subtle px-6">
          <Activity size={22} className="text-pulse" strokeWidth={2.5} />
          <span className="font-display text-lg tracking-wide text-paper">IRONPULSE</span>
        </div>

        <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-5">
          <img
            src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}`}
            alt={user?.name}
            className="h-10 w-10 rounded-full border border-border-subtle object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">{user?.name}</p>
            <RoleBadge role={role} />
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-pulse/10 text-pulse"
                    : "text-muted hover:bg-surface-raised hover:text-paper"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/70 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-0">
        <div className="flex h-16 items-center gap-4 border-b border-border-subtle px-4 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-paper" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-display text-lg tracking-wide text-paper">DASHBOARD</span>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
