"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSenseBlock() {
  const adRef = useRef<HTMLModElement>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current || !adRef.current) return;

    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="googlesyndication"]')) {
        const script = document.createElement("script");
        script.async = true;
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2850341183298193";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }

      // Push the ad
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasLoaded.current = true;
      }
    } catch (error) {
      console.warn("AdSense loading failed:", error);
    }
  }, []);

  return (
    <div className="px-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2850341183298193"
        data-ad-slot="8240875729"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
