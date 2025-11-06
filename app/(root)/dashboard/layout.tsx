

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

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
