import { PricingTable } from '@clerk/nextjs';

const page = () => {
  return (
    <div className='flex h-[calc(100vh-64px)] justify-center items-center mx-10'>
       <PricingTable  newSubscriptionRedirectUrl='/dashboard'/>
    </div>
  );
}

export default page;
