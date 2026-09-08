import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/classes", label: "All Classes" },
  { to: "/forum", label: "Community Forum" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-ink/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Activity size={24} className="text-pulse" strokeWidth={2.5} />
          <span className="font-display text-xl tracking-wide text-paper">IRONPULSE</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-pulse" : "text-muted hover:text-paper"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-pulse" : "text-muted hover:text-paper"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="h-9 w-9 rounded-full border border-border-subtle object-cover"
              />
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted hover:text-paper">
                Login
              </Link>
              <Button onClick={() => navigate("/register")}>Get Started</Button>
            </>
          )}
        </div>

        <button
          className="text-paper md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-border-subtle bg-ink px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-muted hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted">
                  Dashboard
                </Link>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted">
                  Login
                </Link>
                <Button onClick={() => navigate("/register")}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
