export const metadata = {
  title: "Cookie Policy | Mokkio",
  description:
    "Learn about how Mokkio uses cookies to improve your experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

        <div className="space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              What Are Cookies
            </h2>
            <p className="leading-relaxed">
              Cookies are small text files that are stored on your device when
              you visit our website. They help us provide you with a better
              browsing experience by remembering your preferences and
              understanding how you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Cookies We Use
            </h2>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-purple-400">
                  Necessary Cookies
                </h3>
                <p className="mb-3">
                  These cookies are essential for the website to function
                  properly.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-purple-500 pl-3">
                    <strong className="text-white">
                      mokkio_cookie_consent
                    </strong>
                    <p className="text-sm text-white/60">
                      Stores user&apos;s cookie consent preferences
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: Indefinite | Category: Necessary
                    </p>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-3">
                    <strong className="text-white">
                      mokkio_cookie_preferences
                    </strong>
                    <p className="text-sm text-white/60">
                      Stores detailed cookie preferences (analytics, marketing)
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: Indefinite | Category: Necessary
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-blue-400">
                  Analytics Cookies
                </h3>
                <p className="mb-3">
                  These cookies help us understand how visitors interact with
                  our website.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <strong className="text-white">_vercel_analytics</strong>
                    <p className="text-sm text-white/60">
                      Anonymous website usage statistics and user behavior
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 1 year | Provider: Vercel Inc.
                    </p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3">
                    <strong className="text-white">
                      _vercel_speed_insights
                    </strong>
                    <p className="text-sm text-white/60">
                      Performance monitoring and Core Web Vitals measurement
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 1 year | Provider: Vercel Inc.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-orange-400">
                  Marketing Cookies
                </h3>
                <p className="mb-3">
                  These cookies are used to deliver personalized advertisements.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-orange-500 pl-3">
                    <strong className="text-white">__gads</strong>
                    <p className="text-sm text-white/60">
                      Google Ads advertising and retargeting
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 1 year | Provider: Google LLC
                    </p>
                  </div>
                  <div className="border-l-2 border-orange-500 pl-3">
                    <strong className="text-white">__gac</strong>
                    <p className="text-sm text-white/60">
                      Google Ads campaign attribution and conversion tracking
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 90 days | Provider: Google LLC
                    </p>
                  </div>
                  <div className="border-l-2 border-orange-500 pl-3">
                    <strong className="text-white">NID</strong>
                    <p className="text-sm text-white/60">
                      Google user preferences and personalization
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 6 months | Provider: Google LLC
                    </p>
                  </div>
                  <div className="border-l-2 border-orange-500 pl-3">
                    <strong className="text-white">ANID</strong>
                    <p className="text-sm text-white/60">
                      Google advertising identifier
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 1 year | Provider: Google LLC
                    </p>
                  </div>
                  <div className="border-l-2 border-orange-500 pl-3">
                    <strong className="text-white">__gpi</strong>
                    <p className="text-sm text-white/60">
                      Google Partner Integration for cross-site tracking
                    </p>
                    <p className="text-xs text-white/40">
                      Duration: 1 year | Provider: Google LLC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Managing Your Cookies
            </h2>
            <p className="leading-relaxed mb-4">
              You can control your cookie preferences at any time by clicking
              the &quot;Customize&quot; button in our cookie banner. You can
              also:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Clear your browser cookies</li>
              <li>Use incognito/private browsing mode</li>
              <li>Adjust your browser settings to block cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Third-Party Services
            </h2>
            <p className="leading-relaxed">
              We use third-party services that may set their own cookies. These
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <strong>Vercel:</strong> Hosting and analytics platform
              </li>
              <li>
                <strong>Google AdSense:</strong> Advertising network (only if
                accepted)
              </li>
              <li>
                <strong>Ko-fi:</strong> Donation platform (external link)
              </li>
            </ul>
          </section>

          <section className="border-t border-white/20 pt-8">
            <p className="text-sm text-white/60">
              Last updated: October 25, 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
