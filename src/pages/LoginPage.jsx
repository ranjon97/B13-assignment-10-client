import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/FormField";
import { GoogleAuthButton } from "@/components/shared/GoogleAuthButton";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(formData);
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-8">
        <div className="flex flex-col items-center text-center">
          <Activity size={28} className="text-pulse" strokeWidth={2.5} />
          <h1 className="mt-3 font-display text-2xl tracking-wide text-paper">WELCOME BACK</h1>
          <p className="mt-1 text-sm text-muted">Log in to continue your training.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </FormField>

          {error && <p className="text-sm font-medium text-signal">{error}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Log In
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Google sign-in connects once you add your Google OAuth client credentials to the client and
          server environment files.
        </p>

        <GoogleAuthButton onSuccess={() => navigate(redirectTo, { replace: true })} />

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-pulse hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
