"use client";

import { useEffect, useState } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { CookieBanner } from "@/components/CookieBanner";
import { Toaster } from "./ui/sonner";
import { MobileBlocker } from "@/components/MobileBlocker";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <MobileBlocker>
      {children}
      <Toaster />
      {isClient && showBanner && (
        <CookieBanner onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </MobileBlocker>
  );
}
