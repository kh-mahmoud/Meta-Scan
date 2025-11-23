import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your SEO reports, track analysis progress, and view comprehensive insights. Create new reports and monitor your SEO analysis in real-time.",
  robots: {
    index: false,
    follow: false,
  },
};

const Layout = async({children}:{children:React.ReactNode}) => {
  const { has } = await auth();
  const isProMember =has({ plan: "pro" })
  const isStarterMember =has({ plan: "starter" })
  const isPaidMember = isProMember || isStarterMember ;
  if (!isPaidMember) redirect("/pricing");

  return (
    <div>
      {children}
    </div>
  );
}

export default Layout;
