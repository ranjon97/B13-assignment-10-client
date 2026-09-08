import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { classApi } from "@/api/classApi";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { CLASS_CATEGORIES } from "@/utils/format";

const initialState = {
  name: "",
  image: "",
  category: CLASS_CATEGORIES[0],
  difficultyLevel: "beginner",
  duration: "",
  schedule: "",
  price: "",
  description: "",
};

export function AddClassPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload a class image first");
      return;
    }
    setIsSubmitting(true);
    try {
      await classApi.createClass({ ...formData, price: Number(formData.price) });
      toast.success("Class submitted for approval");
      navigate("/dashboard/my-classes");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardHeader title="Add Class" description="New classes require admin approval before going live." />

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-border-subtle bg-surface p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Class Name" htmlFor="name">
            <Input id="name" required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          </FormField>

          <FormField label="Category" htmlFor="category">
            <Select id="category" value={formData.category} onChange={(e) => handleChange("category", e.target.value)}>
              {CLASS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>

          <FormField label="Difficulty Level" htmlFor="difficultyLevel">
            <Select
              id="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={(e) => handleChange("difficultyLevel", e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </FormField>

          <FormField label="Duration" htmlFor="duration">
            <Input
              id="duration"
              placeholder="e.g. 60 minutes"
              required
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </FormField>

          <FormField label="Schedule" htmlFor="schedule">
            <Input
              id="schedule"
              placeholder="e.g. Mon & Wed, 7:00 AM"
              required
              value={formData.schedule}
              onChange={(e) => handleChange("schedule", e.target.value)}
            />
          </FormField>

          <FormField label="Price (USD)" htmlFor="price">
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </FormField>
        </div>

        <div className="mt-4">
          <ImageUploadField value={formData.image} onChange={(url) => handleChange("image", url)} />
        </div>

        <div className="mt-4">
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormField>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-6">
          Submit Class
        </Button>
      </form>
    </div>
  );
}
