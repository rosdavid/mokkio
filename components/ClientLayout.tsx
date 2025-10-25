"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { CookieBanner } from "@/components/CookieBanner";
import { Toaster } from "@/components/ui/sonner";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();

  return (
    <>
      {children}
      <Toaster />
      {showBanner && (
        <CookieBanner onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </>
  );
}
