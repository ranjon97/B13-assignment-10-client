import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Dumbbell, Users, Pencil, Trash2 } from "lucide-react";
import { classApi } from "@/api/classApi";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
import { CLASS_CATEGORIES } from "@/utils/format";

const STATUS_STYLES = {
  approved: "text-pulse border-pulse/30 bg-pulse/10",
  pending: "text-muted border-border-subtle bg-surface-raised",
  rejected: "text-signal border-signal/30 bg-signal/10",
};

export function MyClassesPage() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  const [studentsModalClass, setStudentsModalClass] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadClasses = () => classApi.getMyClasses().then(setClasses).finally(() => setIsLoading(false));

  useEffect(() => {
    loadClasses();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await classApi.deleteClass(deletingClass._id);
      setClasses((prev) => prev.filter((c) => c._id !== deletingClass._id));
      toast.success("Class deleted");
      setDeletingClass(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openStudentsModal = async (fitnessClass) => {
    setStudentsModalClass(fitnessClass);
    try {
      const students = await classApi.getAttendees(fitnessClass._id);
      setAttendees(students);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="My Classes" description="Manage the classes you've created." />

      {classes.length === 0 ? (
        <EmptyState icon={Dumbbell} title="No classes yet" description="Add your first class to get started." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Booked</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {classes.map((fitnessClass) => (
                <tr key={fitnessClass._id}>
                  <td className="px-5 py-4 font-medium text-paper">{fitnessClass.name}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-wide ${STATUS_STYLES[fitnessClass.status]}`}>
                      {fitnessClass.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-paper">{formatCurrency(fitnessClass.price)}</td>
                  <td className="px-5 py-4 text-muted">{fitnessClass.bookingCount || 0}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openStudentsModal(fitnessClass)} className="text-muted hover:text-pulse" aria-label="View students">
                        <Users size={16} />
                      </button>
                      <button onClick={() => setEditingClass(fitnessClass)} className="text-muted hover:text-pulse" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeletingClass(fitnessClass)} className="text-muted hover:text-signal" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingClass && (
        <EditClassModal
          fitnessClass={editingClass}
          onClose={() => setEditingClass(null)}
          onSaved={(updated) => {
            setClasses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            setEditingClass(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingClass)}
        onClose={() => setDeletingClass(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Class"
        description={`Are you sure you want to delete "${deletingClass?.name}"? This cannot be undone.`}
      />

      <Modal isOpen={Boolean(studentsModalClass)} onClose={() => setStudentsModalClass(null)} title="Enrolled Students">
        {attendees.length === 0 ? (
          <p className="text-sm text-muted">No students have booked this class yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {attendees.map((student) => (
              <li key={student._id} className="flex items-center gap-3">
                <img
                  src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`}
                  alt={student.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-paper">{student.name}</p>
                  <p className="text-xs text-muted">{student.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

function EditClassModal({ fitnessClass, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: fitnessClass.name,
    image: fitnessClass.image,
    category: fitnessClass.category,
    difficultyLevel: fitnessClass.difficultyLevel,
    duration: fitnessClass.duration,
    schedule: fitnessClass.schedule,
    price: fitnessClass.price,
    description: fitnessClass.description,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await classApi.updateClass(fitnessClass._id, {
        ...formData,
        price: Number(formData.price),
      });
      toast.success("Class updated");
      onSaved(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Update Class">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Class Name">
          <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </FormField>
        <ImageUploadField value={formData.image} onChange={(url) => handleChange("image", url)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <Select value={formData.category} onChange={(e) => handleChange("category", e.target.value)}>
              {CLASS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Price (USD)">
            <Input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} required />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea rows={3} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} required />
        </FormField>
        <Button type="submit" isLoading={isSaving} className="self-end">Save Changes</Button>
      </form>
    </Modal>
  );
}
