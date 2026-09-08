import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forumApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function AddForumPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", image: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image first");
      return;
    }
    setIsSubmitting(true);
    try {
      await forumApi.createPost(formData);
      toast.success("Forum post published");
      navigate("/dashboard/my-posts");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardHeader title="Add Forum Post" description="Share insights with the IronPulse community." />

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-border-subtle bg-surface p-6">
        <FormField label="Title" htmlFor="title">
          <Input id="title" required value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
        </FormField>

        <div className="mt-4">
          <ImageUploadField value={formData.image} onChange={(url) => handleChange("image", url)} />
        </div>

        <div className="mt-4">
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              rows={6}
              required
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormField>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-6">
          Publish Post
        </Button>
      </form>
    </div>
  );
}
