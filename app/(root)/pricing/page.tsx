import { PricingTable } from '@clerk/nextjs';

const page = () => {
  return (
    <div className='container-pricing'>
       <PricingTable  newSubscriptionRedirectUrl='/dashboard'/>
    </div>
  );
}

export default page;
