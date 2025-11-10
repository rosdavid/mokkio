"use client";

import { useState, useEffect } from "react";

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "mokkio_cookie_consent";
const COOKIE_PREFERENCES_KEY = "mokkio_cookie_preferences";

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
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
      // Marketing cookies not used at the moment
    } else {
      // Show banner if no consent given yet
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);

    // Save to localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));

    // Apply settings
    // Marketing cookies not used at the moment
  };

  const rejectCookies = () => {
    const minimalPrefs = {
      necessary: true,
      functional: false,
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
    // Marketing cookies not used at the moment
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setHasConsented(false);
    setShowBanner(true);
    setPreferences({
      necessary: true,
      functional: false,
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
