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
                <p className="mb-2">
                  These cookies are essential for the website to function
                  properly.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Session management</li>
                  <li>Security features</li>
                  <li>Basic functionality</li>
                </ul>
                <p className="text-sm text-white/60 mt-2">Duration: Session</p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-blue-400">
                  Analytics Cookies
                </h3>
                <p className="mb-2">
                  These cookies help us understand how visitors interact with
                  our website.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Vercel Analytics - Anonymous usage statistics</li>
                  <li>Vercel Speed Insights - Performance monitoring</li>
                </ul>
                <p className="text-sm text-white/60 mt-2">Duration: 1 year</p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-orange-400">
                  Marketing Cookies
                </h3>
                <p className="mb-2">
                  These cookies are used to deliver personalized advertisements.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Google AdSense - Personalized advertising</li>
                  <li>Campaign tracking and measurement</li>
                </ul>
                <p className="text-sm text-white/60 mt-2">
                  Duration: 1-2 years
                </p>
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
