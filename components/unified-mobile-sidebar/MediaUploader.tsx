"use client";

import React from "react";
import Image from "next/image";
import { Upload, Trash2, RefreshCw, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface MediaUploaderProps {
  uploadedImages: (string | null)[];
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onImageRemove: (index: number) => void;
  hideMockup?: boolean;
  onToggleHideMockup?: () => void;
  onClose?: () => void;
}

export function MediaUploader({
  uploadedImages,
  onImageUpload,
  onImageRemove,
  hideMockup,
  onToggleHideMockup,
  onClose,
}: MediaUploaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Media Upload</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4 text-white/60 hover:text-white" />
          </button>
        )}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">
                Mockup {index + 1}
              </p>
            </div>
            <div className="relative group">
              <label className="flex flex-col items-center justify-center cursor-pointer relative aspect-video bg-muted border border-border border-dashed rounded-lg hover:bg-muted/80 transition-colors">
                {uploadedImages[index] ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={uploadedImages[index] || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 220px"
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center">
                      Upload image
                    </span>
                  </>
                )}
                <input
                  id={`file-input-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onImageUpload(e, index)}
                  className="hidden"
                />
              </label>
              {uploadedImages[index] && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onImageRemove(index);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      document.getElementById(`file-input-${index}`)?.click();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 cursor-pointer"
                    title="Replace image"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Hide Mockup Checkbox */}
      <div className="flex items-center space-x-2 pt-2 border-t">
        <Checkbox
          id="hide-mockup"
          checked={hideMockup || false}
          onCheckedChange={onToggleHideMockup}
          className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 cursor-pointer"
        />
        <label htmlFor="hide-mockup" className="text-xs cursor-pointer">
          Hide Mockup
        </label>
      </div>
    </div>
  );
}
