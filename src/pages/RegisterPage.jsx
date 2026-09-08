import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/FormField";
import { GoogleAuthButton } from "@/components/shared/GoogleAuthButton";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!PASSWORD_RULE.test(formData.password)) {
      setError("Password needs 6+ characters with an uppercase and a lowercase letter.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success("Account created! Welcome to IronPulse.");
      navigate("/dashboard", { replace: true });
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
          <h1 className="mt-3 font-display text-2xl tracking-wide text-paper">JOIN IRONPULSE</h1>
          <p className="mt-1 text-sm text-muted">Create your account and start training today.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <FormField label="Full Name" htmlFor="name">
            <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Jane Doe" />
          </FormField>

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

          <FormField label="Profile Image URL" htmlFor="image">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={
              formData.password && !PASSWORD_RULE.test(formData.password)
                ? "Needs 6+ characters, one uppercase and one lowercase letter"
                : ""
            }
          >
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
            Create Account
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <GoogleAuthButton onSuccess={() => navigate("/dashboard", { replace: true })} />

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-pulse hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
