import React from 'react'
import { featureList } from './FeatureSection'
import { FileEdit, LineChart, UserPlus, Users } from 'lucide-react'

function HowItWorks() {
  const workingFeatures:featureList[] = [
    {
      logo: UserPlus ,
      title: 'Professional Onboarding',
      content: 'Share your industry and expertise for personalised guidance'
    },
    {
      logo: FileEdit,
      title: 'Craft your documents',
      content: 'Create ATS-optimised resumes and compelling cover letters'
    },
    {
      logo: Users ,
      title: 'Prepare for interviews',
      content: 'Practice with AI-powered mock interviews tailored to your role'
    },
    {
      logo: LineChart ,
      title: 'Track your progress',
      content: 'Monitor improvements with detailed performance analytics'
    }
  ]
  return (
     <div className='container mx-auto px-4 md:px-6 text-center'>
      <h1 className='font-bold text-3xl mb-5 tracking-tighter'>
        How it works?
      </h1>
      <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl mb-12'>
        Four simple steps to accelerate your career growth
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
        {
            workingFeatures.map((feature,idx)=>(
              <div key={idx} className='text-center'>
                  <feature.logo className='w-10 h-10 mx-auto mb-4 text-primary'/>
                  <h1 className='text-xl mb-4 font-bold'>
                    {feature.title}
                  </h1>
                  <p className=''>
                    {feature.content}
                  </p>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default HowItWorks