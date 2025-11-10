"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Save, Loader2, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";
import { sanitizeMockupName, validateMockupName } from "@/lib/validation";

interface MockupBarProps {
  onSave?: (name: string) => Promise<{ isUpdate?: boolean; message?: string }>;
  initialName?: string;
  onNameChange?: (name: string) => void;
  isExisting?: boolean;
  showRulers?: boolean;
  onToggleRulers?: () => void;
}

export function MockupBar({
  onSave,
  initialName = "Untitled",
  onNameChange,
  isExisting = false,
  showRulers,
  onToggleRulers,
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
    const trimmedName = mockupName.trim();

    // Validate mockup name
    const validationError = validateMockupName(trimmedName);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);

    try {
      // Sanitize the mockup name before saving
      const sanitizedName = sanitizeMockupName(trimmedName);

      if (onSave) {
        const result = await onSave(sanitizedName);
        toast.success(
          result.message ||
            (result.isUpdate ? "Mockup updated!" : "Mockup saved!")
        );

        // Update the display name with the sanitized version
        setMockupName(sanitizedName);
        onNameChange?.(sanitizedName);
      }

      // Redirect to my mockups page after a short delay
      setTimeout(() => {
        router.push("/my-mockups");
      }, 1000);
    } catch {
      toast.error("Failed to save mockup. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 gap-3">
        {/* Left section: Rulers toggle (mobile only) */}
        {onToggleRulers && (
          <Button
            onClick={onToggleRulers}
            variant="ghost"
            size="sm"
            className="h-8 md:hidden"
            title={showRulers ? "Hide guides" : "Show guides"}
          >
            <Ruler
              className={`h-4 w-4 ${showRulers ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        )}

        {/* Right section: Save button */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-muted-foreground md:hidden text-xs">
            {isExisting ? "Edit" : "New"}
          </span>
          <Input
            value={mockupName}
            onChange={(e) => {
              setMockupName(e.target.value);
              onNameChange?.(e.target.value);
            }}
            className="max-w-[200px] h-8 text-sm"
            placeholder="Mockup name..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
          />
          <Button
            onClick={handleSave}
            disabled={isSaving || !mockupName.trim()}
            size="sm"
            className="h-8 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : "Save"}
            </span>
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
