"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";

interface MockupBarProps {
  onSave?: (name: string) => Promise<{ isUpdate?: boolean; message?: string }>;
  initialName?: string;
  onNameChange?: (name: string) => void;
  isExisting?: boolean;
}

export function MockupBar({
  onSave,
  initialName = "Untitled",
  onNameChange,
  isExisting = false,
}: MockupBarProps) {
  const [mockupName, setMockupName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setMockupName(initialName);
  }, [initialName]);

  const handleSave = async () => {
    if (!mockupName.trim()) return;

    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);

    try {
      if (onSave) {
        const result = await onSave(mockupName.trim());
        toast.success(
          result.message ||
            (result.isUpdate ? "Mockup updated!" : "Mockup saved!")
        );
      }

      // Redirect to my mockups page after a short delay
      setTimeout(() => {
        router.push("/my-mockups");
      }, 1000);
    } catch (error) {
      console.error("Error saving mockup:", error);
      toast.error("Failed to save mockup. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 py-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {isExisting ? "Editing" : "New"}
          </span>
          <Input
            value={mockupName}
            onChange={(e) => {
              setMockupName(e.target.value);
              onNameChange?.(e.target.value);
            }}
            className="max-w-xs h-8 text-sm"
            placeholder="Enter mockup name..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || !mockupName.trim()}
            size="sm"
            className="h-8 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
