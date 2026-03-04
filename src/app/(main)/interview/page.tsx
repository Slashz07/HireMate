

import { getAssessments } from '@/actions/quiz'
import React from 'react'
import StatsCards from './_components/StatsCards'
import PerformanceCharts from './_components/PerformanceCharts'
import QuizList from './_components/quizList'

async function page() {

  const assessments=await getAssessments()
  console.log("Assessments: ",assessments)

  return (
    <div>
      <h1 className='text-6xl font-bold gradient-title mb-5'>
        Interview Preparation
      </h1>
      <div className='flex flex-col gap-4'>
        <StatsCards assessments={assessments}/>
        <PerformanceCharts assessments={assessments}/>
        <QuizList assessments={assessments}/>
      </div>
    </div>
  )
}

export default page