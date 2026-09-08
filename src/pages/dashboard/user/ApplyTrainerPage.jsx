import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { trainerApplicationApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { FormField, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { CLASS_CATEGORIES } from "@/utils/format";

export function ApplyTrainerPage() {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ experience: "", specialty: CLASS_CATEGORIES[0] });

  useEffect(() => {
    trainerApplicationApi.getMine().then(setApplication).finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await trainerApplicationApi.apply({
        experience: Number(formData.experience),
        specialty: formData.specialty,
      });
      setApplication(result);
      toast.success("Trainer application submitted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  const hasPending = application?.status === "pending";

  return (
    <div>
      <DashboardHeader title="Apply as Trainer" description="Share your experience to start creating classes." />

      {application && (
        <div className="mb-6 rounded-2xl border border-border-subtle bg-surface p-5">
          <p className="text-sm text-muted">
            Current status:{" "}
            <span className="font-semibold uppercase tracking-wide text-paper">{application.status}</span>
          </p>
          {application.status === "rejected" && application.feedback && (
            <p className="mt-2 text-sm text-muted">
              <span className="font-medium text-paper">Admin feedback: </span>
              {application.feedback}
            </p>
          )}
        </div>
      )}

      {!hasPending && (
        <form onSubmit={handleSubmit} className="max-w-md rounded-2xl border border-border-subtle bg-surface p-6">
          <div className="flex flex-col gap-4">
            <FormField label="Years of Experience" htmlFor="experience">
              <Input
                id="experience"
                type="number"
                min="0"
                required
                value={formData.experience}
                onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
              />
            </FormField>

            <FormField label="Specialty" htmlFor="specialty">
              <Select
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData((p) => ({ ...p, specialty: e.target.value }))}
              >
                {CLASS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormField>

            <Button type="submit" isLoading={isSubmitting} className="mt-2">
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
