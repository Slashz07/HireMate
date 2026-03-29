"use client"
import { quizResultType } from '@/actions/quiz'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Assessment } from '@prisma/client'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'

type QuizResultProps = {
  result: Assessment; 
  onStartNew: () => void;
  hideStartNew?: boolean;
};

function QuizResult({ result, onStartNew, hideStartNew = false }:QuizResultProps) {

  if (!result) return null
  const questions: quizResultType[] = (result?.questions ?? []) as quizResultType[];
  return (
    <div>
      <h1 className='flex items-center gap-2 text-3xl gradient-title'>
        <Trophy className='h-6 w-6 text-yellow-500' />
        Quiz Result
      </h1>
      <CardContent>
        <div>
          <h3 className='text-2xl font-bold text-center'>{result.quizScore?.toFixed(2)}%</h3>
          <Progress value={result.quizScore} className='w-full' />
        </div>
        {
          result.improvementTip && (
            <div className='bg-muted p-4 rounded-lg mt-4 mb-5'>
              <p className='font-medium'>Improvement Tip:</p>
              <p className='text-muted-foreground'>{result.improvementTip}</p>
            </div>
          )
        }
        <div className='space-y-4 mt-2'>
          <h3 className='font-medium'>
            Question Review
          </h3>
          {
            questions?.map((q, idx:number) => (
              <div key={idx} className='border rounded-lg p-4 space-y-2'>
                <div className='flex items-start justify-between gap-2'>
                  <p>{q.question}</p>
                  {
                    q.isCorrect ? (
                      <CheckCircle2 className='h-5 w-5 text-green-500 flex-shrink-0' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
                    )
                  }
                </div>
                <div>
                  <p>Your answer: {q.userAnswer}</p>
                  {!q.isCorrect&&<p>Correct answer: {q.answer}</p>}
                </div>
                <div className='text-sm bg-muted p-2 rounded'>
                  <p className='font-medium'>Explanation: </p>
                  <p>{q.explanation}</p>
                </div>
              </div>
            ))
          }
        </div>
      </CardContent>
      {
        !hideStartNew&&(
          <CardFooter className='mt-4'>
            <Button className='w-full' onClick={onStartNew}>
              Start New Quiz
            </Button>
          </CardFooter>
        )
      }
    </div>
  )
}

export default QuizResult