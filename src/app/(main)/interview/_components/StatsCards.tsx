import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrophyIcon } from 'lucide-react'
import React from 'react'

function StatsCards({assessments}) {
   const quizAvgScore=()=>{
     if(!assessments?.length) return 0
    const total=assessments.reduce((sum,assessment)=>(
        sum+assessment.quizScore
    ),0)
    return (total/(assessments.length)).toFixed(1)
   }
    
   const latestAssessmentScore=()=>{
     if(!assessments?.length) return 0
     return assessments[0].quizScore.toFixed(2)
   }

   const getTotalQuestionsAttempted=()=>{
        if(!assessments?.length) return 0
        return assessments.reduce((count,assessment)=>(
            count+assessment.questions.length
        ),0)
   }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Average Score</CardTitle>
            <TrophyIcon className={`h-4 w-4 `} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{quizAvgScore()}&nbsp;%</div>
            <p className='text-xs text-muted-foreground'>
              Across all assessments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Questions Practiced</CardTitle>
            <TrophyIcon className={`h-4 w-4 `} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {getTotalQuestionsAttempted()}
            </div>
            <p className='text-xs text-muted-foreground'>
                Total questions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Latest Score</CardTitle>
            <TrophyIcon className={`h-4 w-4 `} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{latestAssessmentScore()}&nbsp;%</div>
            <p className='text-xs text-muted-foreground'>
              Most recent Quiz
            </p>
          </CardContent>
        </Card>
    </div>
  )
}

export default StatsCards