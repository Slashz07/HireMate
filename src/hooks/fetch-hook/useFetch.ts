import { IndustryInsights, User } from '@prisma/client'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface formInfo{
    industry:string,
    subIndustry:string,
    bio?:string,
    experience:number,
    skills:string[]
  }

  type UpdateUserFn = (data: formInfo) => Promise<{
  success: true
  updatedUser: User
  industryInsghts: IndustryInsights
}>


function useFetch(cb:UpdateUserFn) {

    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const [data,setData]=useState({})

    async function fetchData(data:formInfo){
        try {
            setLoading(true)
            setError("")
            const res=await cb(data)
            console.log("Updation response: ",res)
            setData(res)
        } catch (error) {
            console.log("Error updating user data in custom hook: ",error)
            if(error instanceof Error){
                setError(error.message)
                toast.error(error.message)
            }
        } finally{
            setLoading(false)
        }
    }  
    return {loading,error,data,fetchData}
}

export default useFetch