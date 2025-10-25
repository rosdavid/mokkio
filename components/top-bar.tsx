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
import {
  Undo2,
  Redo2,
  Maximize2,
  PanelLeft,
  PanelRight,
  RotateCcw,
} from "lucide-react";
import { ExportButton } from "@/components/export-button";
import { useState } from "react";

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
  onToggleLeftSidebar,
  onToggleRightSidebar,
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
        {isMobile ? (
          /* Mobile Layout - Two Rows */
          <div className="flex flex-col w-full">
            {/* Top Row - Logo, Title, Bell and Export */}
            <div className="flex items-center justify-between mb-4">
              {/* Left spacer for centering */}
              <div className="w-20"></div>

              {/* Center Section - Logo and Title */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-base font-bold text-white">Mokcio</span>
              </div>

              {/* Right Section - Bell and Export */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="#fff" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </Button>
                <ExportButton isMobile={isMobile} />
              </div>
            </div>

            {/* Bottom Row - Navigation Controls */}
            <div className="flex items-center justify-center gap-1">
              {/* Sidebar toggles */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-neutral-500 cursor-pointer"
                onClick={onToggleLeftSidebar}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-neutral-500 cursor-pointer"
                onClick={onToggleRightSidebar}
              >
                <PanelRight className="h-4 w-4" />
              </Button>

              {/* Main controls */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-neutral-500 cursor-pointer"
                onClick={handleStartOverClick}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-neutral-500 cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Desktop Layout - Original Single Row */
          <div className="flex items-center justify-between w-full">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="266.667"
                  height="266.667"
                  viewBox="0 0 200 200"
                >
                  <path
                    d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Mokkio</span>
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
        )}
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
