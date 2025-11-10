// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClientLayout } from "@/components/ClientLayout";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mokkio.vercel.app"),
  title: {
    default: "Mokkio – Create Beautiful Device & Browser Mockups For Free",
    template: "%s | Mokkio",
  },
  description:
    "Create device, browser, and code frame mockups in seconds. Full customization: backgrounds, shadow presets, zoom, perspective, effects, and layouts. Export PNG/JPEG/WebP. Free, no sign-up.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Mokkio",
    url: "https://mokkio.vercel.app/",
    title: "Create Beautiful Device & Browser Mockups For Free | Mokkio",
    description:
      "Instant mockups for iPhone, iPad, MacBook, browser & code frames. No watermark, no sign-up.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mokkio – Device & Browser Mockups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mokkio – Create Device & Browser Mockups For Free",
    description:
      "Generate mockups with custom backgrounds, shadow presets, zoom, perspective, effects, and layouts. Free, no sign-up.",
    images: ["/mokkio-app.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico", apple: "/mokkio-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mokkio",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    url: "https://mokkio.vercel.app/",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Device mockups (iPhone, iPad, MacBook, browser, screenshot)",
      "Custom backgrounds & gradients",
      "Shadow presets & effects",
      "Zoom, pan & perspective",
      "High-resolution exports (PNG/JPEG/WebP)",
      "No watermark, no sign-up, free to use",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppJsonLd),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${bricolageGrotesque.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
