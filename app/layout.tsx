import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClerkProvider";
import { Toaster } from "sonner";

const popins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Meta Scan - AI-Powered SEO Report Generator",
    template: "%s | Meta Scan",
  },
  description:
    "Generate comprehensive SEO reports in seconds using AI. Analyze keywords, competitors, backlinks, and content insights with Meta Scan's powerful SEO analysis tool powered by Bright Data and AI.",
  keywords: [
    "SEO analysis",
    "SEO report",
    "keyword research",
    "competitor analysis",
    "backlink analysis",
    "SEO tool",
    "AI SEO",
    "search engine optimization",
    "SEO insights",
    "content analysis",
  ],
  authors: [{ name: "Meta Scan" }],
  creator: "Meta Scan",
  publisher: "Meta Scan",
  metadataBase: process.env.NEXT_PUBLIC_APP_URL 
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Meta Scan",
    title: "Meta Scan - AI-Powered SEO Report Generator",
    description:
      "Generate comprehensive SEO reports in seconds using AI. Analyze keywords, competitors, backlinks, and content insights.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Meta Scan - SEO Report Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Scan - AI-Powered SEO Report Generator",
    description:
      "Generate comprehensive SEO reports in seconds using AI. Analyze keywords, competitors, backlinks, and content insights.",
    images: ["/logo.png"],
    creator: "@metascan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "Meta Scan",
  category: "SEO Tools",
  classification: "SEO Analysis Tool",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
  },
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${popins.variable} antialiased`}>
          <Header />
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
