import { useState } from "react";
import { uploadApi } from "@/api/index";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const base64Image = await fileToBase64(file);
      const url = await uploadApi.uploadImage(base64Image, {
        mimeType: file.type,
        sizeBytes: file.size,
      });
      return url;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
}
