import { Badge } from "./ui/badge";
import { BarChart3, CheckCircle, MessageSquare, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Features = () => {
  return (
    <section className="feature-section">
      <div className="feature-section-container">
        <div className="feature-section-header">
          <h2 className="feature-section-title">Choose Your SEO Superpower</h2>
          <p className="feature-section-description">
            Whether you&apos;re just getting started or need advanced insights,
            we&apos;ve got the perfect plan for you.
          </p>
        </div>

        <div className="feature-grid">
          {/* Starter Plan Card */}
          <Card className="feature-card feature-card-starter">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full -translate-y-16 translate-x-16" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="feature-card-icon-wrapper feature-card-icon-starter">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <Badge className="feature-card-badge-starter">Starter</Badge>
              </div>
              <CardTitle className="text-2xl">Full SEO Reports</CardTitle>
              <CardDescription className="text-base">
                Generate comprehensive SEO reports powered by Bright Data&apos;s
                advanced SERP Perplexity Scraper technology.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Complete SERP analysis</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Keyword ranking insights</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Competitor analysis</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Export to PDF/CSV</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan Card */}
          <Card className="feature-card group feature-card-pro">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-400/30 via-pink-400/30 to-orange-400/30 rounded-full -translate-y-16 translate-x-16" />
            <Badge className="absolute top-4 right-4 bg-linear-to-r from-purple-600 to-pink-600 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1 text-yellow-300" />
              Popular
            </Badge>
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="feature-card-icon-wrapper feature-card-icon-pro">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <Badge className="feature-card-badge-pro">Pro</Badge>
              </div>
              <CardTitle className="text-2xl">Chat With Your Report</CardTitle>
              <CardDescription className="text-base">
                Everything in Starter, plus the power to have intelligent
                conversations with your SEO data using GPT.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>All Starter features</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span className="font-medium">AI-powered chat interface</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Ask questions about your data</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Get actionable recommendations</span>
                </div>
                <div className="feature-card-list-item">
                  <CheckCircle className="feature-card-list-icon" />
                  <span>Priority support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
