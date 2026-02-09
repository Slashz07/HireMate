"use client"
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onBoardingSchema } from '@/lib/schema'
import { string, toLowerCase, z } from 'zod'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/fetch-hook/useFetch'
import { updateUser } from '@/actions/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
interface industryType {
  id: string,
  name: string,
  subIndustries: string[]
}
interface formInfo{
    industry:string,
    subIndustry:string,
    bio?:string,
    experience:number,
    skills:string[]
  }

function OnBoardingForm({ industries }: { industries: industryType[] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch } = useForm({
      defaultValues: {
        industry: "",
        subIndustry: "",
        bio: "",
        experience: 0,
        skills: "",
      },
      resolver: zodResolver(onBoardingSchema)
    }
    )
  const [industryData, setIndustryData] = useState<industryType | undefined>()
  const {
    error:err,
    data:res,
    fetchData:fn,
    loading:isLoading
  }=useFetch(updateUser)
  const router=useRouter()

  const watchIndustry=watch("industry")


  const formSubmit:SubmitHandler<formInfo>=async (data)=>{
    console.log("submitted")
    try {
      const formattedIndustry=`${data.industry}-${data.subIndustry
        .toLowerCase().replace(/ /g,"-")
      }`

      await fn({
        ...data,
        industry:formattedIndustry
      })
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    if(!isLoading&&Object.keys(res).length>0&&!err){
      toast.success("User Onboarded Successfully!")
      router.push('/dashBoard')
      router.refresh()
    }
  },[isLoading,res])
  return (
    <div className='flex justify-center items-center bg-background'>
      <Card className='w-full max-w-lg mt-10 mx-2'>
        <CardHeader>
          <CardTitle className='gradient-title text-4xl'>Complete Your Profile</CardTitle>
          <CardDescription>
            Select your industry to get personalised career insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(formSubmit)} className='space-y-2'>
            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry</Label>
              <Select 
              onValueChange={(val) => {
                setValue("industry",val)
                setIndustryData(industries.find((ind) => ind.id == val))
                setValue("subIndustry","")
              }} >
                <SelectTrigger className="w-full" id='industry'>
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {
                    industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {
                errors.industry && (
                  <p className='text-sm text-red-500'>
                    {errors.industry.message}
                  </p>
                )
              }
            </div>

            {watchIndustry &&
            <div className='space-y-2'>
              <Label htmlFor='Sub-Industry'>Sub-Industry</Label>
              <Select
              onValueChange={(val) => {
                setValue("subIndustry",val)
              }} >
                <SelectTrigger className="w-full" id='sub-Industry'>
                  <SelectValue placeholder="Select a  sub-Industry" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {
                    industryData?.subIndustries.map((subInd,idx) => (
                      <SelectItem key={idx} value={subInd}>{subInd}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {
                errors.subIndustry && (
                  <p className='text-sm text-red-500'>
                    {errors.subIndustry.message}
                  </p>
                )
              }
            </div>}

             <div className='space-y-2'>
              <Label htmlFor='exp'>Years of Experience</Label>
              <Input
              type='number'
              id='exp'
              min='0'
              max='50' 
              placeholder='Enter years of experience'
              {...register("experience")}
              />
              {
                errors.experience && (
                  <p className='text-sm text-red-500'>
                    {errors.experience.message}
                  </p>
                )
              }
            </div>
            
             <div className='space-y-2'>
              <Label htmlFor='skills'>Skills</Label>
              <Input
              type='text'
              id='skills'
              placeholder='e.g., Python,JacaScript,Project Management'
              {...register("skills")}
              />
              <p className='text-sm text-muted-foreground'>
                Separate multiple skills with commas
              </p>
              {
                errors.skills && (
                  <p className='text-sm text-red-500'>
                    {errors.skills.message}
                  </p>
                )
              }
            </div>
            <div className='space-y-2'>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
              id='bio'
              placeholder='Tell us about your professional background'
              {...register("bio")}
              />
              {
                errors.bio && (
                  <p className='text-sm text-red-500'>
                    {errors.bio.message}
                  </p>
                )
              }
            </div>
              <Button className='w-full mt-2' type='submit' disabled={isLoading}>
                {
                  isLoading?(
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    Saving..
                  </>
                ):"Complete Profile"
                }
                
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default OnBoardingForm