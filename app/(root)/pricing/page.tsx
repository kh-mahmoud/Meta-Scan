import { PricingTable } from '@clerk/nextjs';
import React from 'react';

const page = () => {
  return (
    <div>
       <PricingTable newSubscriptionRedirectUrl='/dashboard'/>
    </div>
  );
}

export default page;
