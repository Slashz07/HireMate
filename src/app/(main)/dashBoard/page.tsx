import { updateDashBoard } from '@/actions/dashBoard'
import { getOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'
import DashBoardView from './_components/DashBoardView'
import { IndustryInsights } from '@prisma/client'

export const dynamic = 'force-dynamic';

async function industryInsights() {
    const {isOnBoarded}=await getOnboardingStatus()
    if(!isOnBoarded){
        redirect("/onBoarding")
    }
    const insights=await updateDashBoard()
  return (
    <div className='container mx-auto'>
      <DashBoardView insights={insights as IndustryInsights}/>
      {/* 
        Here , this component is kept as a server component so that server based functions could be called as done above, as this cant be dont in client components.
        In client components when server actions(server functions defined with "user server") are called,this call is treated as a networking request and performed , but that too can only be done when user submits a form , or invokes an event...we cant just call it as we have done in above case bacause a client component first needs to render the ui component before it can make any function call,
        directly making a function call is something only server components can perform as in above case.
        Thats why  to keep the client components separate from here , we put the client side code in a separate component and call it from here i.e DashBoardView,allowing us to call the server components here
      */}
    </div>
  )
}

export default industryInsights