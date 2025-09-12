import { ChevronRight, Save, X, Upload, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rewardApi } from "@/lib/api/rewardApi";
import { useSelectedRewardStore } from "@/store/useSelectedRewardStore";
import OverlayDrawer from "../OverlayDrawer";
import NextImage from "next/image";
// import type { Reward } from "@/generated/prisma";

interface RewardFormData {
  name: string;
  description: string;
  cost: number;
}

export const RewardDetailsDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const queryClient = useQueryClient();
  const { selectedRewardId, clearSelectedReward } = useSelectedRewardStore();

  // Fetch reward data if editing
  const { data: reward, isLoading: isLoadingReward } = useQuery({
    queryKey: ["reward", selectedRewardId],
    queryFn: () => rewardApi.getById(selectedRewardId!),
    enabled: !!selectedRewardId,
  });

  const isEditing = !!selectedRewardId;

  // Form setup with React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RewardFormData>({
    defaultValues: {
      name: "",
      description: "",
      cost: 0,
    },
    mode: "onChange",
  });

  // Populate form when reward data loads
  useEffect(() => {
    if (reward) {
      reset({
        name: reward.name,
        description: reward.description,
        cost: parseInt(reward.cost.toString()),
      });
      setImageUrls(reward.imageCollection || []);
    }
  }, [reward, reset]);

  // Create reward mutation
  const { mutate: createReward } = useMutation({
    mutationFn: (data: RewardFormData) =>
      rewardApi.create({
        ...data,
        imageCollection: imageUrls,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reward"] });
      reset();
      setImageUrls([]);
      clearSelectedReward();
      setIsOpen(false);
    },
  });

  // Update reward mutation
  const { mutate: updateReward } = useMutation({
    mutationFn: (data: RewardFormData) =>
      rewardApi.update(selectedRewardId!, {
        ...data,
        cost: parseInt(data.cost.toString()),
        imageCollection: imageUrls,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reward"] });
      reset();
      setImageUrls([]);
      clearSelectedReward();
      setIsOpen(false);
    },
  });

  const onSubmit = (data: RewardFormData) => {
    if (isEditing) {
      updateReward(data);
    } else {
      createReward(data);
    }
  };

  const handleCancel = () => {
    reset();
    setImageUrls([]);
    clearSelectedReward();
    setIsOpen(false);
  };

  // Compress image to reduce file size
  const compressImage = useCallback(
    (file: File, maxSizeMB: number = 1): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions (max 1200px width/height)
          const maxDimension = 1200;
          let { width, height } = img;

          if (width > height) {
            if (width > maxDimension) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);

          // Try different quality levels to get under 1MB
          const tryCompress = (quality: number) => {
            const dataURL = canvas.toDataURL("image/jpeg", quality);
            const sizeInMB = (dataURL.length * 0.75) / (1024 * 1024); // Approximate size

            if (sizeInMB <= maxSizeMB || quality <= 0.1) {
              resolve(dataURL);
            } else {
              tryCompress(quality - 0.1);
            }
          };

          tryCompress(0.8); // Start with 80% quality
        };

        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  // Handle file upload with compression
  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);
      setIsCompressing(true);

      try {
        for (const file of fileArray) {
          if (file.type.startsWith("image/")) {
            try {
              // Check original file size
              const originalSizeMB = file.size / (1024 * 1024);

              if (originalSizeMB > 1) {
                // Compress the image
                const compressedDataURL = await compressImage(file, 1);
                setImageUrls((prev) => [...prev, compressedDataURL]);
              } else {
                // File is already under 1MB, use as is
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result as string;
                  setImageUrls((prev) => [...prev, result]);
                };
                reader.readAsDataURL(file);
              }
            } catch (error) {
              console.error("Error processing image:", error);
            }
          }
        }
      } finally {
        setIsCompressing(false);
      }
    },
    [compressImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      handleFileUpload(files);
    },
    [handleFileUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <OverlayDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="h-full  bg-zinc-900 border-l border-zinc-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-700 p-3">
          <span className="text-sm font-medium text-white">
            {isEditing ? "Edit Reward" : "Create Reward"}
          </span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-zinc-700 transition-colors"
            onClick={handleCancel}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingReward ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Reward Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Reward Name
                </label>
                <input
                  {...register("name", {
                    required: "Reward name is required",
                    minLength: {
                      value: 1,
                      message: "Reward name must not be empty",
                    },
                    maxLength: {
                      value: 100,
                      message: "Reward name must be less than 100 characters",
                    },
                  })}
                  type="text"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reward name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 1,
                      message: "Description must not be empty",
                    },
                    maxLength: {
                      value: 500,
                      message: "Description must be less than 500 characters",
                    },
                  })}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter reward description"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Cost (Points)
                </label>
                <input
                  {...register("cost", {
                    required: "Cost is required",
                    min: {
                      value: 1,
                      message: "Cost must be at least 1 point",
                    },
                    max: {
                      value: 1000000,
                      message: "Cost must be less than 1,000,000 points",
                    },
                  })}
                  type="number"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter cost in points"
                />
                {errors.cost && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.cost.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Images{" "}
                  {isCompressing && (
                    <span className="text-blue-400">(Compressing...)</span>
                  )}
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-400 bg-blue-900/20"
                      : isCompressing
                        ? "border-blue-400 bg-blue-900/10"
                        : "border-zinc-600 hover:border-zinc-500"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                >
                  {isCompressing ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-2"></div>
                      <p className="text-sm text-blue-400 mb-2">
                        Compressing images to under 1MB...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-zinc-400 mb-2" />
                      <p className="text-sm text-zinc-400 mb-2">
                        Drag and drop images here, or click to select
                      </p>
                      <p className="text-xs text-zinc-500 mb-2">
                        Images will be automatically compressed to under 1MB
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="image-upload"
                        disabled={isCompressing}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer text-blue-400 hover:text-blue-300 text-sm font-medium ${
                          isCompressing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Choose files
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Image Thumbnails */}
              {imageUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Uploaded Images ({imageUrls.length})
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-20">
                          <NextImage
                            src={url}
                            alt={`Upload ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border border-zinc-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  disabled={
                    isSubmitting || imageUrls.length === 0 || isCompressing
                  }
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isCompressing
                      ? "Processing..."
                      : isEditing
                        ? "Update Reward"
                        : "Create Reward"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </OverlayDrawer>
  );
};

export default RewardDetailsDrawer;
