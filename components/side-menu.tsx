"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  MessageSquareWarning,
  Sparkles,
  Heart,
  X,
  User,
  LogOut,
  Shield,
  Settings,
  Image as ImageIcon,
  Share,
  Plus,
  EllipsisVertical,
  SquarePlus,
  Instagram,
  Twitter,
  ImageUp,
  Sun,
  Moon,
  Monitor,
  Brush,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks";
import { AuthModal } from "@/components/auth/AuthModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase";

interface SideMenuProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
}

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AccountManagementModal({
  isOpen,
  onClose,
}: AccountManagementModalProps) {
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { user } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (
    user: { user_metadata?: { username?: string }; email?: string } | null
  ) => {
    const name = user?.user_metadata?.username || user?.email || "";
    return name.charAt(0).toUpperCase();
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (newUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setLoading(true);
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { username: newUsername.trim() },
      });

      if (error) throw error;

      // Also update the profile in the database
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username: newUsername.trim() })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      toast.success("Username updated successfully");
      setNewUsername("");
    } catch (error: unknown) {
      logger.error("Error updating username:", error);
      toast.error("Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      if (updateError) throw updateError;

      // Also update the profile in the database
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      toast.success("Profile picture updated successfully");
    } catch (error: unknown) {
      logger.error("Error uploading avatar:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("Bucket not found")) {
        toast.error(
          "Storage bucket not configured. Please contact support or create an 'avatars' bucket in Supabase Storage."
        );
      } else {
        toast.error("Failed to upload profile picture");
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-popover border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Account Info */}
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-medium text-foreground mb-4">
              Current Account
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.user_metadata?.username || user?.email || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <ImageUp className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    <span className="text-muted-foreground">{user?.email}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-foreground">
                      Username:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {user?.user_metadata?.username || "Not set"}
                    </span>
                  </p>
                </div>
                {uploadingAvatar && (
                  <p className="text-xs text-primary mt-2">Uploading...</p>
                )}
              </div>
            </div>
          </div>

          {/* Change Username */}
          <form onSubmit={handleUpdateUsername} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Change Username
              </Label>
              <Input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? "Updating..." : "Update Username"}
            </Button>
          </form>

          {/* Password Reset */}
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Change Password</Label>
              <p className="text-sm text-muted-foreground mt-1">
                To change your password, we&apos;ll send you a reset link to
                your email.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                toast.info("Change Password is not implemented yet");
              }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Password Reset Email"}
            </Button>
          </div>

          {/* Account Actions */}
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-3">
              Account Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => {
                  toast.info("Account deletion is not implemented yet");
                }}
              >
                Delete Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => {
                  toast.info("Data export is not implemented yet");
                }}
              >
                Export My Data
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SideMenu({ isOpen, isClosing, onClose }: SideMenuProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const isAdmin = user?.user_metadata?.role === "admin";
  const goToAdmin = () => {
    window.location.href = "/admin";
  };
  const goToMyMockups = () => {
    window.location.href = "/my-mockups";
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Helper function to get user initials
  const getUserInitials = (
    user: { user_metadata?: { username?: string }; email?: string } | null
  ) => {
    const name = user?.user_metadata?.username || user?.email || "";
    return name.charAt(0).toUpperCase();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${
          isClosing
            ? "animate-out fade-out duration-300"
            : "animate-in fade-in duration-300"
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-full md:w-1/3 bg-background border-r border-border z-50 shadow-2xl ${
          isClosing
            ? "animate-out slide-out-to-left duration-300"
            : "animate-in slide-in-from-left duration-300"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 200 200"
                >
                  <path
                    d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Mokkio
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Auth Section */}
            {user ? (
              <div className="w-full p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-all duration-200 group text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={
                          user.user_metadata?.username || user.email || "User"
                        }
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-foreground block">
                        {user.user_metadata.username || user.email}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
                {/* Botones según el rol del usuario */}
                {isAdmin ? (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer"
                      onClick={goToAdmin}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer"
                      onClick={() => setShowAccountModal(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer"
                      onClick={goToMyMockups}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Mockups
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-200 group text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    Sign In / Sign Up
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create or access your account to save your work and access
                  anytime
                </p>
              </button>
            )}

            {/* Appearance Section */}
            <div className="relative w-full p-4 rounded-xl bg-card border border-border overflow-hidden group/appearance">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Brush className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium text-foreground">
                    Appearance
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose the theme mode that works best for you
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {/* Light Mode */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`relative group/button overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer ${
                      theme === "light"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border hover:border-primary/50 bg-background hover:bg-accent/50"
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          theme === "light"
                            ? "bg-linear-to-br from-yellow-400 to-orange-500 shadow-sm shadow-yellow-500/30"
                            : "bg-linear-to-br from-yellow-400/20 to-orange-500/20"
                        }`}
                      >
                        <Sun
                          className={`h-5 w-5 transition-all duration-200 ${
                            theme === "light"
                              ? "text-white scale-110"
                              : "text-yellow-600 group-hover/button:text-yellow-500 group-hover/button:scale-110"
                          }`}
                        />
                        {/* Animated rays */}
                        {theme === "light" && (
                          <div
                            className="absolute inset-0 animate-spin"
                            style={{ animationDuration: "4s" }}
                          >
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-0.5 h-1 bg-yellow-300/60 left-1/2 top-0 origin-bottom"
                                style={{
                                  transform: `rotate(${i * 45}deg) translateY(-16px)`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Dark Mode */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`relative group/button overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border hover:border-primary/50 bg-background hover:bg-accent/50"
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-linear-to-br from-indigo-500 to-purple-600 shadow-sm shadow-purple-500/30"
                            : "bg-linear-to-br from-indigo-500/20 to-purple-600/20"
                        }`}
                      >
                        <Moon
                          className={`h-5 w-5 transition-all duration-200 ${
                            theme === "dark"
                              ? "text-white scale-110"
                              : "text-indigo-600 group-hover/button:text-indigo-500 group-hover/button:scale-110"
                          }`}
                        />
                        {/* Stars effect */}
                        {theme === "dark" && (
                          <>
                            <div className="absolute top-2 right-2.5 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                            <div
                              className="absolute top-3 right-1.5 w-0.5 h-0.5 bg-white/70 rounded-full animate-pulse"
                              style={{ animationDelay: "0.5s" }}
                            ></div>
                            <div
                              className="absolute bottom-2.5 left-2 w-0.5 h-0.5 bg-white/70 rounded-full animate-pulse"
                              style={{ animationDelay: "1s" }}
                            ></div>
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* System Mode */}
                  <button
                    onClick={() => setTheme("system")}
                    className={`relative group/button overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer ${
                      theme === "system"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border hover:border-primary/50 bg-background hover:bg-accent/50"
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          theme === "system"
                            ? "bg-linear-to-br from-blue-500 to-cyan-500 shadow-sm shadow-blue-500/30"
                            : "bg-linear-to-br from-blue-500/20 to-cyan-500/20"
                        }`}
                      >
                        <Monitor
                          className={`h-5 w-5 transition-all duration-200 ${
                            theme === "system"
                              ? "text-white scale-110"
                              : "text-blue-600 group-hover/button:text-blue-500 group-hover/button:scale-110"
                          }`}
                        />
                        {/* Pulse ring effect */}
                        {theme === "system" && (
                          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping"></div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Row - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="mailto:contactmokkio@gmail.com"
                className="p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-all duration-200 group text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquareWarning className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">
                    Send Feedback
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Help us improve Mokkio
                </p>
              </a>

              <a
                href="https://davidros.vercel.app/blog/mokkio-devlog-04"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-all duration-200 group text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">
                    What&apos;s New in Mokkio
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Latest updates & features
                </p>
              </a>
            </div>

            {/* Full Width Items */}
            <div className="relative w-full p-6 rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 hover:from-primary/20 hover:via-primary/10 hover:to-primary/20 transition-all duration-200 group text-left overflow-hidden flex flex-col justify-end min-h-[200px]">
              {/* Video Background */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  style={{ pointerEvents: "none" }}
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                </video>
                {/* Overlay degradado y filtro: de color a transparente en el bottom */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-b from-blue-900/40 via-purple-900/30 to-transparent backdrop-blur-xs"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-lg font-semibold text-white">
                    Create Beautiful Mockups
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Design stunning device mockups with professional tools and
                  effects
                </p>
              </div>
            </div>

            <div className="relative w-full p-6 rounded-xl bg-card border border-border hover:bg-accent/50 transition-all duration-200 group text-left overflow-hidden flex flex-col justify-end min-h-[200px]">
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <div className="absolute inset-0 w-full h-full scale-125">
                  <Image
                    src="/mokkio.me-1762060449027.png"
                    alt="Mokkio background"
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    className="absolute top-0 left-0"
                  />
                </div>
                {/* Overlay degradado y filtro: de color a transparente en el bottom */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-b from-blue-900/40 via-purple-900/30 to-transparent backdrop-blur-xs"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-lg font-semibold text-white">
                    {isMobile ? "Available in Desktop" : "Available in Mobile"}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {isMobile
                    ? "Full desktop experience with advanced features and larger canvas"
                    : "Access Mokkio on your mobile device for on-the-go mockup creation"}
                </p>
              </div>
            </div>

            {/* PWA Installation Instructions - Desktop Only */}
            {!isMobile && (
              <div className="relative w-full p-6 rounded-xl bg-linear-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 hover:from-green-500/20 hover:via-emerald-500/10 hover:to-green-500/20 transition-all duration-200 group text-left overflow-hidden flex flex-col justify-end min-h-[300px]">
                {/* Gradient Background */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-linear-to-br from-green-500/20 via-emerald-500/10 to-green-500/20"></div>
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-black/20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Plus className="h-6 w-6 text-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      Install Mokkio PWA
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Get the full mobile experience by installing Mokkio as a
                    Progressive Web App on your smartphone.
                  </p>

                  {/* Installation Instructions */}
                  <div className="space-y-6">
                    {/* iOS Instructions */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-xs text-white font-bold">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
                          </svg>
                        </span>
                        iOS / iPadOS
                      </h4>
                      <div className="space-y-2 flexflex-col">
                        {[
                          <>
                            Tap the share button{" "}
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-foreground rounded-full">
                              <Share className="w-4 h-4 text-accent" />
                            </span>
                          </>,
                          <>
                            Tap
                            <span className="inline-flex items-center ml-2 gap-2 px-3 py-1 bg-foreground text-accent rounded-md text-sm font-semibold shadow-md">
                              <SquarePlus className="w-5 h-5 text-accent" />
                              Add to Home Screen
                            </span>
                          </>,
                          "Tap 'Add' to confirm",
                          "The Mokkio app will appear on your home screen!",
                        ].map((instruction, index) => (
                          <div
                            key={`ios-${index}`}
                            className="flex items-start gap-3"
                          >
                            <div className="shrink-0 w-5 h-5 bg-gray-500/20 rounded-full flex items-center justify-center mt-1">
                              <span className="text-xs font-semibold text-foreground/80">
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed flex-1 flex items-center">
                              {instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Android Instructions */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 512 512"
                            xmlSpace="preserve"
                            fill="white"
                          >
                            <path d="M120.606 169h270.788v220.663c0 13.109-10.628 23.737-23.721 23.737H340.55v67.203c0 17.066-13.612 30.897-30.415 30.897-16.846 0-30.438-13.831-30.438-30.897V413.4h-47.371v67.203c0 17.066-13.639 30.897-30.441 30.897-16.799 0-30.437-13.831-30.437-30.897V413.4h-27.099c-13.096 0-23.744-10.628-23.744-23.737V169zm-53.065-1.801c-16.974 0-30.723 13.963-30.723 31.2v121.937c0 17.217 13.749 31.204 30.723 31.204 16.977 0 30.723-13.987 30.723-31.204V198.399c0-17.237-13.746-31.2-30.723-31.2m323.854-20.435H120.606c3.342-38.578 28.367-71.776 64.392-90.998l-25.746-37.804c-3.472-5.098-2.162-12.054 2.946-15.525C167.3-1.034 174.242.286 177.731 5.38l28.061 41.232c15.558-5.38 32.446-8.469 50.208-8.469 17.783 0 34.672 3.089 50.229 8.476L334.29 5.395c3.446-5.108 10.41-6.428 15.512-2.957 5.108 3.471 6.418 10.427 2.946 15.525l-25.725 37.804c36.024 19.21 61.032 52.408 64.372 90.997m-177.53-52.419c0-8.273-6.699-14.983-14.969-14.983-8.291 0-14.99 6.71-14.99 14.983 0 8.269 6.721 14.976 14.99 14.976s14.969-6.707 14.969-14.976m116.127 0c0-8.273-6.722-14.983-14.99-14.983-8.291 0-14.97 6.71-14.97 14.983 0 8.269 6.679 14.976 14.97 14.976 8.269 0 14.99-6.707 14.99-14.976m114.488 72.811c-16.956 0-30.744 13.984-30.744 31.222v121.98c0 17.238 13.788 31.226 30.744 31.226 16.978 0 30.701-13.987 30.701-31.226v-121.98c.001-17.238-13.723-31.222-30.701-31.222" />
                          </svg>
                        </span>
                        Android
                      </h4>
                      <div className="space-y-2">
                        {[
                          <>
                            Tap the menu button
                            <span className="mx-2 inline-flex items-center justify-center w-6 h-6 bg-foreground rounded-full">
                              <EllipsisVertical className="w-4 h-4 text-accent" />
                            </span>
                          </>,
                          <>
                            Tap
                            <span className="inline-flex items-center ml-2 gap-2 px-3 py-1 bg-foreground text-accent rounded-md text-sm font-semibold shadow-md">
                              <SquarePlus className="w-5 h-5 text-accent" />
                              Add to Home screen
                            </span>
                          </>,
                          "Tap 'Add' to confirm",
                          "The Mokkio app will appear on your home screen!",
                        ].map((instruction, index) => (
                          <div
                            key={`android-${index}`}
                            className="flex items-start gap-3"
                          >
                            <div className="shrink-0 w-5 h-5 bg-gray-500/20 rounded-full flex items-center justify-center mt-1">
                              <span className="text-xs font-semibold text-foreground/80">
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed flex-1 flex items-center">
                              {instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="relative w-full p-6 rounded-xl bg-linear-to-r from-pink-500/10 via-red-500/5 to-pink-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:via-red-500/10 hover:to-pink-500/20 transition-all duration-200 group text-left overflow-hidden flex flex-col justify-end min-h-[200px]">
              {/* Gradient Background */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-linear-to-br from-pink-500/20 via-red-500/10 to-pink-500/20"></div>
                {/* Overlay sutil */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-black/20"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <Heart className="h-6 w-6 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-foreground">
                    Show us Your Love
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Help us keep Mokkio free for everyone. Your support means the
                  world to us!
                </p>
                <a
                  href="https://buymeacoffee.com/mokkio"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-600 hover:text-pink-700 transition-all duration-200 text-sm font-medium"
                >
                  <Heart className="h-4 w-4" />
                  Support Mokkio
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <a
                href="https://instagram.com/mokkio.me"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-card border border-border hover:bg-accent/50 transition-all duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/mokkioapp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-card border border-border hover:bg-accent/50 transition-all duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="p-2 rounded-lg">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 200 200"
                >
                  <path
                    d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Mokkio
                </h2>
                <p className="text-sm text-muted-foreground">v1.0.0-beta.4</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="/privacy-policy"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookie-policy"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <AccountManagementModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </>
  );
}
