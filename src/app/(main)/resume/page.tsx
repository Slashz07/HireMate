import { getResume } from '@/actions/resume'
import React from 'react'
import ResumeBuilder, { resumeSchemaType } from './_components/ResumeBuilder'

const resume = async () => {
    const resume=await getResume()
    console.log("Resume recieved from db: ",resume)
  return (
    <div>
        <ResumeBuilder initialContent={resume?resume.content as resumeSchemaType:null}/>
    </div>
  )
}

export default resume