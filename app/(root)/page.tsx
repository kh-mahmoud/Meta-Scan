import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Integrations from "@/components/integrations";
import Footer from "@/components/Footer";
import { Suspense } from "react";

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
