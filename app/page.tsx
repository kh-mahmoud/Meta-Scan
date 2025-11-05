"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  CheckCircle,
  Sparkles,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Integrations from "@/components/integrations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <Hero />

      {/* Feature Highlights */}
      <Features />
      {/* Pricing Section */}
       <Pricing/>

      {/* Social Proof / Trust Builders */}
     <Integrations/>

     <Footer/>
    </div>
  );
}
