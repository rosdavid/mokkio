"use client";

interface FooterProps {
  variant?: "minimal" | "full";
  showStartButton?: boolean;
  onStartClick?: () => void;
}

export function Footer({
  variant = "full",
  showStartButton = false,
  onStartClick,
}: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (variant === "minimal") {
    return (
      <footer className="bg-[#0a0a0a] border-t border-white/10 py-8 w-full">
        <div className="w-full px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <a
                href="/privacy-policy"
                className="text-white/70 hover:text-white transition-colors hover:underline"
              >
                Privacy Policy
              </a>
              <span className="text-white/40">•</span>
              <a
                href="/terms-of-service"
                className="text-white/70 hover:text-white transition-colors hover:underline"
              >
                Terms of Service
              </a>
              <span className="text-white/40">•</span>
              <a
                href="/cookie-policy"
                className="text-white/70 hover:text-white transition-colors hover:underline"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-12 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 sm:max-w-7xl sm:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 200 200"
                className="drop-shadow-lg"
              >
                <path
                  d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                  fill="#fff"
                />
              </svg>
              <span className="text-xl font-bold text-white">Mokkio</span>
            </div>
            <p className="text-gray-400 mb-4">
              Create stunning mockups in seconds. Free, no sign-up, and no
              watermark.
            </p>
            {showStartButton && onStartClick && (
              <button
                onClick={onStartClick}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start Creating
              </button>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("features-section")}
                  className="text-gray-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("howitworks-section")}
                  className="text-gray-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("mockups-section")}
                  className="text-gray-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Mockups
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 py-6"></div>
      </div>
    </footer>
  );
}
