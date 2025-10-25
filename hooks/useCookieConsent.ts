"use client";

import { useState, useEffect } from "react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "mokkio_cookie_consent";
const COOKIE_PREFERENCES_KEY = "mokkio_cookie_preferences";

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [hasConsented, setHasConsented] = useState(false);
  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consentGiven === "true" && savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      setHasConsented(true);

      // Apply cookie settings
      if (!parsedPreferences.marketing) {
        disableAdSense();
      } else {
        enableAdSense();
      }
    } else {
      // Show banner if no consent given yet
      setShowBanner(true);
    }
  }, []);

  const disableAdSense = () => {
    // Remove AdSense script if it exists
    const adsenseScript = document.querySelector(
      'script[src*="googlesyndication"]'
    );
    if (adsenseScript) {
      adsenseScript.remove();
    }

    // Also remove any AdSense elements that might be on the page
    const adsenseElements = document.querySelectorAll("[data-ad-client]");
    adsenseElements.forEach((el) => el.remove());
  };

  const enableAdSense = () => {
    // Re-add AdSense script if marketing cookies are accepted
    if (!document.querySelector('script[src*="googlesyndication"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2850341183298193";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  };

  const acceptCookies = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);

    // Save to localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));

    // Apply settings
    if (!prefs.marketing) {
      disableAdSense();
    } else {
      enableAdSense();
    }
  };

  const rejectCookies = () => {
    const minimalPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    setPreferences(minimalPrefs);
    setHasConsented(true);
    setShowBanner(false);

    // Save to localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(minimalPrefs));

    // Apply settings (disable everything non-essential)
    disableAdSense();
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setHasConsented(false);
    setShowBanner(true);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  return {
    showBanner,
    preferences,
    hasConsented,
    acceptCookies,
    rejectCookies,
    resetConsent,
  };
}
