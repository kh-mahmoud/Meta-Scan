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
    <section className="py-20 sm:py-32 bg-linear-to-r from-emerald-50/50 via-blue-50/50 to-purple-50/50 dark:from-emerald-950/50 dark:via-blue-950/50 dark:to-purple-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your SEO needs. Upgrade or downgrade
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Pricing */}
          <Card className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/80 dark:to-cyan-950/80">
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
                  className="w-full mt-6 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
                  size="lg"
                >
                  Subscribe to Starter
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Pricing */}
          <Card className="border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 relative bg-linear-to-br from-purple-50/80 via-pink-50/80 to-rose-50/80 dark:from-purple-950/80 dark:via-pink-950/80 dark:to-rose-950/80">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-pink-600 text-white border-0">
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
                  className="w-full mt-6 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
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
