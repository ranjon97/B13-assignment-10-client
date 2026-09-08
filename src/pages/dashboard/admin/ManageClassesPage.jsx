import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { classApi } from "@/api/classApi";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency } from "@/utils/format";

const STATUS_STYLES = {
  approved: "text-pulse border-pulse/30 bg-pulse/10",
  pending: "text-muted border-border-subtle bg-surface-raised",
  rejected: "text-signal border-signal/30 bg-signal/10",
};

export function ManageClassesPage() {
  const [classes, setClasses] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectingClass, setRejectingClass] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [deletingClass, setDeletingClass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClasses = () => {
    setIsLoading(true);
    classApi
      .getAllForAdmin({ page })
      .then((res) => {
        setClasses(res.data);
        setMeta(res.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleApprove = async (fitnessClass) => {
    try {
      await classApi.moderateClass(fitnessClass._id, { status: "approved" });
      toast.success("Class approved");
      loadClasses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await classApi.moderateClass(rejectingClass._id, { status: "rejected", feedback });
      toast.success("Class rejected");
      setRejectingClass(null);
      setFeedback("");
      loadClasses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await classApi.adminDeleteClass(deletingClass._id);
      toast.success("Class deleted");
      setDeletingClass(null);
      loadClasses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Manage Classes" description="Approve, reject, or remove submitted classes." />

      {classes.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No classes submitted yet" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border-subtle">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Trainer</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface">
                {classes.map((fitnessClass) => (
                  <tr key={fitnessClass._id}>
                    <td className="px-5 py-4 font-medium text-paper">{fitnessClass.name}</td>
                    <td className="px-5 py-4 text-muted">{fitnessClass.trainer?.name}</td>
                    <td className="px-5 py-4 text-paper">{formatCurrency(fitnessClass.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-wide ${STATUS_STYLES[fitnessClass.status]}`}>
                        {fitnessClass.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {fitnessClass.status !== "approved" && (
                          <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => handleApprove(fitnessClass)}>
                            Approve
                          </Button>
                        )}
                        {fitnessClass.status !== "rejected" && (
                          <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setRejectingClass(fitnessClass)}>
                            Reject
                          </Button>
                        )}
                        <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => setDeletingClass(fitnessClass)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={Boolean(rejectingClass)} onClose={() => setRejectingClass(null)} title="Reject Class">
        <div className="flex flex-col gap-4">
          <Textarea
            rows={3}
            placeholder="Explain why this class was rejected..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button variant="danger" isLoading={isSubmitting} onClick={handleReject} className="self-end">
            Confirm Rejection
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingClass)}
        onClose={() => setDeletingClass(null)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Delete Class"
        description={`Permanently delete "${deletingClass?.name}"?`}
      />
    </div>
  );
}
