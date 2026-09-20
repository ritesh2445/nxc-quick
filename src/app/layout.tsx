import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export const metadata: Metadata = {
  title: "NXC Verse — Premium NFC + QR Digital Identity Cards",
  description:
    "Luxury NFC and QR-enabled visiting cards cast in aerospace-grade metal with permanent sovereign digital profiles. One tap to share everything.",
  keywords: [
    "NFC Business Card",
    "Luxury Metal Visiting Card",
    "Digital Identity",
    "QR Visiting Card",
    "NXC Verse",
    "Executive Networking",
  ],
  authors: [{ name: "NXC Verse" }],
  metadataBase: new URL("https://nxcverse.in"),
  openGraph: {
    title: "NXC Verse — Premium NFC + QR Digital Identity Cards",
    description:
      "Luxury NFC and QR-enabled visiting cards cast in aerospace-grade metal with permanent sovereign digital profiles.",
    url: "https://nxcverse.in",
    siteName: "NXC Verse",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth overflow-x-hidden max-w-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body
        className="bg-[#0A0A0B] text-[#F2F0EC] antialiased min-h-screen flex flex-col justify-between selection:bg-accent-silver/20 selection:text-white overflow-x-hidden w-full max-w-full relative"
        suppressHydrationWarning
      >
        <SiteNav />
        <main className="flex-grow w-full overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
