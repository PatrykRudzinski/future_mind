import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/lib/config";

import "./globals.css";
import { cn } from "@/lib/utils/cn";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(config.app.url),
  title: {
    default: config.app.name,
    template: `%s | ${config.app.name}`,
  },
  description: config.app.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: config.app.name,
    description: config.app.description,
    url: "/",
    siteName: config.app.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: config.app.name,
    description: config.app.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "antialiased", "font-sans", dmSans.variable)}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <QueryProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Toaster richColors position="bottom-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
