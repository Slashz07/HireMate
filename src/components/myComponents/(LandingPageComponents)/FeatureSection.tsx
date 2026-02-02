import { BrainCircuit, Briefcase, LineChart, LucideIcon, Scroll } from 'lucide-react'
import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card'

export interface featureList{
  logo:LucideIcon,
  title:string,
  content:string
}

function FeatureSection() {
  const features:featureList[] = [
    {
      logo: BrainCircuit ,
      title: 'AI-Powered Career Guidance',
      content: 'Get personalised career advice and insights powered by advanced AI technology'
    },
    {
      logo: Briefcase,
      title: 'Interview Preparation',
      content: 'Practice with role-specific questions and get instant feedback to improve your performance'
    },
    {
      logo: LineChart ,
      title: 'Industry Insights',
      content: 'Stay ahead with real-time industry trends,salary data, and market analysis'
    },
    {
      logo: Scroll ,
      title: 'Smart Resume Creation',
      content: 'Generate ATS-optimised resumes with AI assistance'
    }
  ]
  return (
    <div className='container mx-auto px-4 md:px-6 text-center'>
      <h1 className='font-bold text-3xl mb-12 tracking-tighter'>
        Powerfull features for your growth
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
        {
          features.map((feature, idx) => (
            <Card key={idx} className='min-w-18 border-2 hover:border-primary transition-colors duration-300'>
              <CardContent className='flex flex-col items-center'>
                  {<feature.logo className='w-10 h-10 mb-4 text-primary' />}
                  <h1 className='font-bold text-xl'>{feature.title}</h1>
                  <p>{feature.content}</p>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  )
}

export default FeatureSection