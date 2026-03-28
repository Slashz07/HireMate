"use client"
import { createCoverLetter } from '@/actions/coverLetters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/fetch-hook/useFetch'
import { coverLetterSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'


export type coverLetterType={
    companyName:string,
    JobTitle:string,
    jobDescription:string,
}

function CreateNewCoverLetter() {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      JobTitle: "",
      jobDescription: ""
    }
  })
  const router = useRouter()
  const {
    data: coverLetterData,
    fetchData: coverLetterFn,
    loading: creatingCoverLetter,
    error: coverLetterError,
  } = useFetch(createCoverLetter)

  const generateCoverLetter = async (data:coverLetterType) => {
    try {
      console.log("cover letter form data recieved: ", data)
      await coverLetterFn(data)
    } catch (error) {
      console.log("Error creating cover letter: ", error)
    }
  }
  const toastId = "create-cover-letter";
  useEffect(() => {
    if (creatingCoverLetter) {
      toast.loading("creating cover letter", { id: toastId })
    } else if (coverLetterData) {
      reset()
      toast.success("Cover letter created successfully", { id: toastId })
      router.push("/Ai_Cover_Letter")
    } else if (coverLetterError) {
      toast.error("Error creating cover letter", { id: toastId })
    }
  }, [coverLetterData, creatingCoverLetter, coverLetterError])
  return (
    <div>
      <div className='flex flex-col space-y-2 mx-2 mt-4 items-start'>
        <Button variant={"outline"} className='gap-2 pl-0' onClick={() => router.push('/Ai_Cover_Letter')}>
          <ArrowLeft className='h-4 w-4' />
          Back to Cover Letters
        </Button>
        <div>
          <h1 className='text-5xl font-bold gradient-title md:text-6xl'> Create Cover Letter</h1>
          <p className='text-muted-foreground text-sm my-3 ml-2'>Generate a tailored cover letter for your job application</p>
        </div>
      </div>


      <div>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide information about the position you&apos;re applying for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 mb-3">
                <label htmlFor="JobTitle" className='text-sm font-medium'>Job Title</label>
                <Input
                  id='JobTitle'
                  placeholder="Enter job title"
                  {...register("JobTitle")}
                />
                {errors.JobTitle && (
                  <p className="text-red-500 text-sm">{errors.JobTitle?.message as string}</p>
                )}
              </div>
              <div className="space-y-4 mb-3">
                <label htmlFor="companyName" className='text-sm font-medium'>Company Name</label>
                <Input
                  id='companyName'
                  placeholder="Enter Company name"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">{errors.companyName?.message as string}</p>
                )}
              </div>
              <div className="space-y-4 mb-3">
                <label htmlFor="jobDescription" className='text-sm font-medium'>Job Description</label>
                <Controller
                  control={control}
                  name='jobDescription'
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id='jobDescription'
                      placeholder="Paste the job description here"
                    />
                  )}
                />
                {errors.jobDescription && (
                  <p className="text-red-500 text-sm">{errors.jobDescription?.message as string}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-end'>
            <Button className='' onClick={handleSubmit(generateCoverLetter)}>
              Generate Cover Letter
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  )
}

export default CreateNewCoverLetter