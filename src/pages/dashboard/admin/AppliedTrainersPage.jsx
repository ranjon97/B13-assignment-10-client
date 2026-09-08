import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipboardList } from "lucide-react";
import { trainerApplicationApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/format";

export function AppliedTrainersPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadApplications = () =>
    trainerApplicationApi.getPending().then(setApplications).finally(() => setIsLoading(false));

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (decision) => {
    setIsSubmitting(true);
    try {
      await trainerApplicationApi.review(selectedApplication._id, { decision, feedback });
      toast.success(`Application ${decision}`);
      setApplications((prev) => prev.filter((a) => a._id !== selectedApplication._id));
      setSelectedApplication(null);
      setFeedback("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Applied Trainers" description="Review pending trainer applications." />

      {applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No pending applications" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-3">Applicant</th>
                <th className="px-5 py-3">Experience</th>
                <th className="px-5 py-3">Specialty</th>
                <th className="px-5 py-3">Applied</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {applications.map((application) => (
                <tr key={application._id}>
                  <td className="px-5 py-4 font-medium text-paper">{application.user?.name}</td>
                  <td className="px-5 py-4 text-muted">{application.experience} yrs</td>
                  <td className="px-5 py-4 text-muted">{application.specialty}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(application.createdAt)}</td>
                  <td className="px-5 py-4">
                    <Button
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => setSelectedApplication(application)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        title="Trainer Application"
      >
        {selectedApplication && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-paper">{selectedApplication.user?.name}</p>
              <p className="text-xs text-muted">{selectedApplication.user?.email}</p>
            </div>
            <p className="text-sm text-muted">
              <span className="text-paper">Experience:</span> {selectedApplication.experience} years
            </p>
            <p className="text-sm text-muted">
              <span className="text-paper">Specialty:</span> {selectedApplication.specialty}
            </p>
            <Textarea
              rows={3}
              placeholder="Optional feedback for the applicant..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="danger" isLoading={isSubmitting} onClick={() => handleReview("rejected")}>
                Reject
              </Button>
              <Button isLoading={isSubmitting} onClick={() => handleReview("approved")}>
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
