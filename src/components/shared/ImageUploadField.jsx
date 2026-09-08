import { ImagePlus } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { InlineSpinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";

export function ImageUploadField({ value, onChange, label = "Image" }) {
  const { uploadImage, isUploading } = useImageUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted">{label}</label>
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border-subtle text-muted">
            <ImagePlus size={20} />
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm text-paper hover:border-pulse/50">
          {isUploading ? <InlineSpinner /> : <ImagePlus size={15} />}
          {isUploading ? "Uploading..." : "Choose Image"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
}
