import Link from "next/link";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";


const Pricing = () => {
  return (
    <section className="bg-gradient-pricing">
      <div className="container-section">
        <div className="section-title-center">
          <h2 className="section-title">
            Simple, Transparent Pricing
          </h2>
          <p className="section-description">
            Choose the plan that fits your SEO needs. Upgrade or downgrade
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Pricing */}
          <Card className="pricing-card-starter">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl mb-2">Starter</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  $19
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-2">
                Perfect for small businesses and individual marketers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Bright Data SERP scraping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">PDF & CSV exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Email support</span>
                </div>
              </div>
              <Link href="/pricing">
                <Button
                  className="w-full mt-6 button-gradient-blue"
                  size="lg"
                >
                  Subscribe to Starter
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Pricing */}
          <Card className="pricing-card-pro">
            <Badge className="pricing-badge-popular">
              Most Popular
            </Badge>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl mb-2">Pro</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  $49
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-2">
                For agencies and power users who need AI insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Everything in Starter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    AI Chat with reports
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
              <Link href="/pricing">
                <Button
                  className="w-full mt-6 button-gradient-purple"
                  size="lg"
                >
                  Subscribe to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
