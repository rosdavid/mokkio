"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { X, Settings, Check } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieBannerProps {
  onAccept: (preferences: CookiePreferences) => void;
  onReject: () => void;
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allPreferences);
    onAccept(allPreferences);
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  const handleReject = () => {
    onReject();
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Can't disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {!showDetails ? (
          // Banner simple
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                🍪 We use cookies
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We use cookies to enhance your experience, analyze site usage,
                and assist in our marketing efforts. By continuing to use our
                site, you agree to our use of cookies.
              </p>
            </div>
            <div className="flex flex-row gap-2 shrink-0">
              <Button
                onClick={() => setShowDetails(true)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 cursor-pointer border border-neutral-800 bg-neutral-900"
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
              <Button
                onClick={handleReject}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 cursor-pointer border border-neutral-800 bg-neutral-900"
              >
                Reject All
              </Button>
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Banner detallado con opciones
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                Cookie Preferences
              </h3>
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Necessary Cookies</h4>
                  <p className="text-white/60 text-sm mt-1">
                    Required for the website to function properly. These cannot
                    be disabled.
                  </p>
                  <div className="text-xs text-white/40 mt-2">
                    <strong>Cookies:</strong> mokkio_cookie_consent,
                    mokkio_cookie_preferences
                  </div>
                </div>
                <div className="text-white/40 text-sm">Always Active</div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <button
                  onClick={() => togglePreference("functional")}
                  className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                    preferences.functional
                      ? "bg-green-600 border-green-600"
                      : "border-white/40"
                  }`}
                >
                  {preferences.functional && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Functional Cookies</h4>
                  <p className="text-white/60 text-sm mt-1">
                    Enable enhanced functionality and personalization, such as
                    user authentication and preferences.
                  </p>
                  <div className="text-xs text-white/40 mt-2">
                    <strong>Cookies:</strong> sb-*-auth-token
                    <br />
                    <strong>Provider:</strong> Supabase Inc.
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <button
                  onClick={() => togglePreference("analytics")}
                  className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                    preferences.analytics
                      ? "bg-purple-600 border-purple-600"
                      : "border-white/40"
                  }`}
                >
                  {preferences.analytics && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Analytics Cookies</h4>
                  <p className="text-white/60 text-sm mt-1">
                    Help us understand how visitors interact with our website by
                    collecting anonymous information.
                  </p>
                  <div className="text-xs text-white/40 mt-2">
                    <strong>Cookies:</strong> _vercel_analytics,
                    _vercel_speed_insights
                    <br />
                    <strong>Provider:</strong> Vercel Inc.
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <button
                  onClick={() => togglePreference("marketing")}
                  className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                    preferences.marketing
                      ? "bg-orange-600 border-orange-600"
                      : "border-white/40"
                  }`}
                >
                  {preferences.marketing && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Marketing Cookies</h4>
                  <p className="text-white/60 text-sm mt-1">
                    Used to deliver personalized advertisements and measure
                    campaign effectiveness.
                  </p>
                  <div className="text-xs text-white/40 mt-2">
                    <span>Not used at the moment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 border-t border-white/10">
              <Button
                onClick={handleReject}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 cursor-pointer border border-neutral-800 bg-neutral-900"
              >
                Reject All
              </Button>
              <Button
                onClick={handleAcceptSelected}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
