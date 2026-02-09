import React from 'react'
import OnBoardingForm from './_components/OnBoardingForm'
import { industries } from '@/data/industries'
import { getOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

async function page() {
  const {isOnBoarded}=await getOnboardingStatus()
  if(isOnBoarded){
    redirect("/dashBoard")
  }
  return (
    <main className='py-32'>
        <OnBoardingForm industries={industries}/>
    </main>
  )
}

export default page