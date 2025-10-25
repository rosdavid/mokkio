"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Undo2, Redo2, Maximize2 } from "lucide-react";
import { ExportButton } from "@/components/export-button";
import { useState } from "react";
import Image from "next/image";

interface TopBarProps {
  onStartOver?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  // Mobile sidebar controls
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  isMobile?: boolean;
}

export function TopBar({
  onStartOver,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isMobile = false,
}: TopBarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleStartOverClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmStartOver = () => {
    setShowConfirmDialog(false);
    onStartOver?.();
  };

  const handleCancelStartOver = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="flex px-4 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Left Section - Ko-fi Support */}
          <div className="flex items-center justify-center">
            <a
              href="https://ko-fi.com/R5R31NC8IM"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                width={180}
                height={0}
                style={{ border: "0px", height: "36px" }}
                src="https://storage.ko-fi.com/cdn/brandasset/v2/support_me_on_kofi_beige.png?_gl=1*jzb8ds*_gcl_au*ODc1MTI4ODI0LjE3NjEzNjc4OTA.*_ga*MjEwMjUwMjk4MS4xNzYxMzY3ODkw*_ga_M13FZ7VQ2C*czE3NjEzNjc4ODkkbzEkZzEkdDE3NjEzNjk0MzUkajUzJGwwJGgw"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </div>

          {/* Center Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/60 hover:text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/60 hover:text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-white/60 hover:text-neutral-500 cursor-pointer"
              onClick={handleStartOverClick}
            >
              Start Over
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/60 hover:text-neutral-500 cursor-pointer"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <svg className="h-5 w-5" fill="#fff" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </Button>
            <ExportButton isMobile={isMobile} />
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Are you sure?</DialogTitle>
            <DialogDescription className="text-white/70">
              This action will reset all settings to their default
              configuration. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelStartOver}
              className="text-white/60 hover:text-neutral-500 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStartOver}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Start Over
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
