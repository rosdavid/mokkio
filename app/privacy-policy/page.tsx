import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when
              you create an account, use our services, or contact us for
              support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, and communicate with
              you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Information Sharing
            </h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please
              contact us at: contactmokkio@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Last updated: October 2025
        </div>
      </div>
    </div>
  );
}
