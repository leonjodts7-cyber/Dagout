import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalBackButton from "@/components/GlobalBackButton";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { SITE_URL } from "@/lib/admin";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dagout.be — Teambuilding platform voor Belgische bedrijven",
    template: "%s | Dagout.be",
  },
  description:
    "Vind en plan de perfecte teambuilding activiteit voor je team. AI-zoekfunctie en interactieve kaart voor bedrijven in België.",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: SITE_URL,
    siteName: "Dagout.be",
    title: "Dagout.be — Teambuilding platform",
    description:
      "Vind en plan de perfecte teambuilding activiteit voor je team in Vlaanderen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dagout.be",
    description: "Teambuilding platform voor Belgische bedrijven",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <ToastProvider>
            <GlobalBackButton />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
