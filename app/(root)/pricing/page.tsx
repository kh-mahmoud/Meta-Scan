import { PricingTable } from '@clerk/nextjs';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the perfect plan for your SEO needs. Starter plan for basic SEO reports or Pro plan with AI chat capabilities. Upgrade or downgrade anytime.",
  openGraph: {
    title: "Pricing Plans - Meta Scan",
    description:
      "Simple, transparent pricing for SEO analysis. Choose Starter for basic reports or Pro for AI-powered insights.",
  },
};

const page = () => {
  return (
    <div className='container-pricing'>
       <PricingTable  newSubscriptionRedirectUrl='/dashboard'/>
    </div>
  );
}

export default page;
