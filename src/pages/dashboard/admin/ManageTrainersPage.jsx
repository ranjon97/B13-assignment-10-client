import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Award } from "lucide-react";
import { userApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ManageTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [demotingTrainer, setDemotingTrainer] = useState(null);
  const [isDemoting, setIsDemoting] = useState(false);

  const loadTrainers = () => userApi.getTrainers().then(setTrainers).finally(() => setIsLoading(false));

  useEffect(() => {
    loadTrainers();
  }, []);

  const handleDemote = async () => {
    setIsDemoting(true);
    try {
      await userApi.demote(demotingTrainer.id);
      setTrainers((prev) => prev.filter((t) => t.id !== demotingTrainer.id));
      toast.success("Trainer demoted to user");
      setDemotingTrainer(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDemoting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Manage Trainers" description="View and manage all active trainers." />

      {trainers.length === 0 ? (
        <EmptyState icon={Award} title="No trainers yet" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {trainers.map((trainer) => (
                <tr key={trainer.id}>
                  <td className="px-5 py-4 font-medium text-paper">{trainer.name}</td>
                  <td className="px-5 py-4 text-muted">{trainer.email}</td>
                  <td className="px-5 py-4">
                    <Button
                      variant="danger"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => setDemotingTrainer(trainer)}
                    >
                      Demote to User
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(demotingTrainer)}
        onClose={() => setDemotingTrainer(null)}
        onConfirm={handleDemote}
        isLoading={isDemoting}
        title="Demote Trainer"
        description={`Remove trainer privileges from "${demotingTrainer?.name}"?`}
      />
    </div>
  );
}
