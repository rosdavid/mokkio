"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Undo2,
  Redo2,
  Keyboard,
  Download,
  Heart,
  ChevronLeft,
  Save,
  Ruler,
} from "lucide-react";
import { ExportButton } from "@/components/export-button";
import { SideMenu } from "@/components/side-menu";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";

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
  // Side menu controls
  showMenu?: boolean;
  isMenuClosing?: boolean;
  onMenuClick?: () => void;
  onCloseMenu: () => void;
  // Save menu props
  onSave?: (name: string) => Promise<{ isUpdate?: boolean; message?: string }>;
  initialName?: string;
  onNameChange?: (name: string) => void;
  isExisting?: boolean;
  // PWA detection
  isPWA?: boolean;
  // Guides and rulers (Smart guides integrated)
  showRulers?: boolean;
  onToggleRulers?: () => void;
}

export function TopBar({
  onStartOver,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isMobile = false,
  showMenu = false,
  isMenuClosing = false,
  onMenuClick,
  onCloseMenu,
  onSave,
  initialName,
  onNameChange,
  isExisting,
  isPWA = false,
  showRulers = false,
  onToggleRulers,
}: TopBarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editableName, setEditableName] = useState(initialName || "Untitled");

  useEffect(() => {
    setEditableName(initialName || "Untitled");
  }, [initialName]);
  const exportButtonRef = useRef<{ openMenu: () => void }>(null);
  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "z" &&
        !event.shiftKey &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        onUndo?.();
      } else if (event.key === "y" && event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        onRedo?.();
      } else if (event.key === "z" && event.shiftKey && event.metaKey) {
        event.preventDefault();
        onRedo?.();
      } else if (event.key === "e" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        exportButtonRef.current?.openMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onUndo, onRedo]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradientMove {
        background-size: 200% 200%;
        animation: gradientMove 3s ease-in-out infinite;
      }
      @keyframes heartbeatColor {
        0%, 100% { color: #f43f5e; }
        40% { color: #b91c1c; }
        60% { color: #b91c1c; }
        80% { color: #f43f5e; }
      }
      .animate-heartbeat {
        animation: heartbeatColor 1.6s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      <div className="flex items-center justify-between w-full md:px-4 md:py-4">
        {/* Left Section */}
        <div className="items-center justify-center flex gap-2">
          <ChevronLeft
            className="text-foreground cursor-pointer md:hidden"
            onClick={onMenuClick}
          />
          <div className="flex h-9 w-9 items-center justify-center md:hidden">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="266.667"
              height="266.667"
              viewBox="0 0 200 200"
            >
              <path
                d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                fill="currentColor"
              />
            </svg>
          </div>
          <a
            href="https://buymeacoffee.com/mokkio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground/80 hover:bg-accent/50 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:border-border cursor-pointer"
            >
              <Heart className="h-4 w-4 animate-heartbeat text-red-500" />
              <span className="text-sm font-medium hidden md:flex">
                Support Mokkio
              </span>
            </Button>
          </a>
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              title={
                showRulers
                  ? "Hide Rulers & Smart Guides"
                  : "Show Rulers & Smart Guides"
              }
              className={`transition-all h-8 w-8 duration-200 flex items-center p-2 rounded-lg border cursor-pointer ${
                showRulers
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground/80 hover:bg-accent/50 border-border/50 hover:border-border"
              }`}
              onClick={onToggleRulers}
            >
              <Ruler className="h-4 w-4" />
            </Button>
          )}
        </div>
        {/* Center Section */}
        <div className="flex items-center md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground/80 cursor-pointer"
            onClick={handleStartOverClick}
          >
            Start Over
          </Button>
          <Popover open={showShortcuts} onOpenChange={setShowShortcuts}>
            <PopoverTrigger className="hidden md:flex" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground/80 cursor-pointer"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover border-border text-popover-foreground supports-backdrop-filter:bg-popover/80 backdrop-blur-xl supports-backdrop-filter:backdrop-saturate-150">
              <div className="p-4 space-y-3">
                <h4 className="font-semibold text-center">
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Undo2 className="h-4 w-4" />
                      <span>Undo</span>
                    </div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-sans">
                      {isMac ? "⌘ Z" : "Ctrl Z"}
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Redo2 className="h-4 w-4" />
                      <span>Redo</span>
                    </div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-sans">
                      {isMac ? "⌘ ⇧ Z" : "Ctrl Y"}
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-sans">
                      {isMac ? "⌘ E" : "Ctrl E"}
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      <span>Toggle Rulers</span>
                    </div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-sans">
                      {isMac ? "⌘ '" : "Ctrl '"}
                    </kbd>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Desktop Mockup Info */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {isExisting ? "Editing" : "New"}
              </span>
              <Input
                value={editableName}
                onChange={(e) => {
                  setEditableName(e.target.value);
                  onNameChange?.(e.target.value);
                }}
                className="w-full h-8 text-sm border-border bg-background! px-2"
                placeholder="Enter mockup name..."
              />
            </div>
          )}
          {!isPWA && (
            <Button
              onClick={async () => {
                if (onSave) {
                  await onSave(editableName);
                }
              }}
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground/80 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border"
            >
              <Save className="h-5 w-5" />
            </Button>
          )}
          <ExportButton ref={exportButtonRef} isMobile={isMobile} />
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Are you sure?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action will reset all settings to their default
              configuration. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelStartOver}
              className="text-muted-foreground hover:text-foreground/80 cursor-pointer"
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

      <SideMenu
        isOpen={showMenu}
        isClosing={isMenuClosing}
        onClose={onCloseMenu}
      />
    </>
  );
}
