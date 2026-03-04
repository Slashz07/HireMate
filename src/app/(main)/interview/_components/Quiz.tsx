"use client"
import { generateQuiz, saveQuizData } from '@/actions/quiz'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useFetch from '@/hooks/fetch-hook/useFetch'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import QuizResult from './QuizResult'

function Quiz() {

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showExplanation, setShowExplanation] = useState(false)



  const {
    loading: generatingQuiz,
    fetchData: generateQuizFn,
    data: quizData,
    setData: setQuizData
  } = useFetch(generateQuiz)

  const {
    loading: savingQuiz,
    fetchData: saveQuizFn,
    data: resultData,
    setData: setResultData
  } = useFetch(saveQuizData)

  useEffect(() => {
    if (quizData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(new Array(quizData.length).fill(null))
    }
  }, [quizData])

  const handleAns = (value: string) => {
    const ans = [...answers]
    ans[currentQuestion] = value
    setAnswers(ans)
  }


  const handlePrev = () => {
    setCurrentQuestion(currentQuestion - 1)
    setShowExplanation(false)
  }

  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans == quizData[idx].correctAnswer) {
        score++;
      }
    })
    return (score / quizData.length) * 100
  }

  const handleSubmit = async () => {
    try {
      const score = calculateScore()
      const res = await saveQuizFn(quizData, answers, parseFloat(score.toFixed(2)))
      console.log("Quiz submit res: ", res)
      toast.success("Quiz submitted successfully")
    } catch (error) {
      console.log("error submitting quiz: ", error)
      toast.error("Quiz couldn't be submitted")
    }
  }


  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      handleSubmit()
    }
  }

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setQuizData(null);
    setResultData(null)
  }

  if (generatingQuiz) {
    return <BarLoader className='mt-4' width={"100%"} color='gray' />
  }
  if (resultData) {
    return (
      <div className='mx-2'>
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    )
  }
  if (!quizData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ready to test your knoweldge ?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            This quiz contains 10 questions specific to your industry and skills.Take your time and choose the best answer for each questoion
          </p>
        </CardContent>
        <CardFooter>
          <Button className='w-full' onClick={generateQuizFn}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const question = quizData[currentQuestion]

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion + 1} of {quizData.length}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-lg  font-medium mb-2'>
            {question.question}
          </p>
          <RadioGroup defaultValue="option-one"
            value={answers[currentQuestion]}
            onValueChange={handleAns}
          >
            {
              question.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <RadioGroupItem value={`${opt}`} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`}>{opt}</Label>
                </div>
              ))
            }
          </RadioGroup>
          {
            showExplanation && (
              <div className='mt-4 p-4 bg-muted rounded-lg'>
                <p className='font-medium'>Explanation: </p>
                <p className='text-muted-foreground'>{question.explanation}</p>
              </div>
            )
          }
        </CardContent>
        <CardFooter >
          {
            !showExplanation && (
              <Button disabled={!answers[currentQuestion]} onClick={() => setShowExplanation(true)}>
                Show Explanation
              </Button>
            )
          }
          <div className='ml-auto flex gap-2'>
            {
              currentQuestion > 0 && (
                <Button variant={'outline'} onClick={handlePrev}>
                  Previous
                </Button>
              )
            }
            <Button variant={'outline'} onClick={handleNext} disabled={!answers[currentQuestion] || savingQuiz}>
              {
                savingQuiz && <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              }
              {
                currentQuestion < quizData.length - 1 ? "Next" : "Finish Quiz"
              }
            </Button>
          </div>

        </CardFooter>
      </Card>
    </div>
  )

}

export default Quiz