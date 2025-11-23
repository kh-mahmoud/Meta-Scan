import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Integrations from "@/components/integrations";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Generate beautiful SEO reports in seconds with Meta Scan. Harness the power of Bright Data's SERP Perplexity Scraper to create comprehensive SEO analysis reports instantly. Fast, simple, and incredibly insightful.",
  openGraph: {
    title: "Meta Scan - Generate Beautiful SEO Reports in Seconds",
    description:
      "Generate comprehensive SEO reports instantly using AI-powered analysis. Fast, simple, and incredibly insightful.",
  },
};

export default function Home() {
  return (
    <div className="bg-gradient-home">
      {/* Hero Section */}
      <Hero />
      {/* Feature Highlights */}
      <Features />
      {/* Pricing Section */}
      <Pricing />

      {/* Integration tech*/}
      <Integrations />
      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
