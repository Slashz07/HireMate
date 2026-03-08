"use client"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import QuizResult from './QuizResult'

function QuizList({ assessments }) {
  const router = useRouter()
  const [performance, setPerformance] = useState(null)
  return (
    <div>
      <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
        <CardHeader>
          <CardTitle className='text-3xl gradient-title'>Recent Quizzes</CardTitle>
          <CardDescription>Review our past quiz performance</CardDescription>
          <CardAction>
            <Button onClick={() => router.push('./interview/Mock')}>Start new Quiz</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {
              assessments.map((assessment, i) => (
                <Card key={i} onClick={() => setPerformance(assessment)}>
                  <CardHeader>
                    <CardTitle className='text-3xl gradient-title'>Quiz {i + 1}</CardTitle>
                    <CardDescription className='flex justify-between'>
                      <div>
                        Score: {assessment.quizScore.toFixed(2)}%
                      </div>
                      <div>
                        {
                          format(new Date(assessment.createdAt), "MMMM dd,yyyy HH:mm")
                        }
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!performance} onOpenChange={()=>setPerformance(null)}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
            <QuizResult
              result={performance}
              onStartNew={()=>router.push('/interview/Mock')}
              hideStartNew
            />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuizList