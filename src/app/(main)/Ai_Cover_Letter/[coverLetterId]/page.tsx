import { getCoverLetter } from '@/actions/coverLetters'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import MarkDown from './_components/MarkDown'
import Link from 'next/link'

async function CoverLetterMarkdown({params}:{params:Promise<{coverLetterId:string}>}) {
    const {coverLetterId}=await params
    const coverLetterContent=await getCoverLetter(coverLetterId)
  return (
     <div className='container mx-auto space-y-4 py-6'>
        <div className='flex flex-col space-y-2 mx-2'>
            <Link href={'/Ai_Cover_Letter'}>
                <Button variant={"outline"} className='gap-2 pl-0'>
                    <ArrowLeft  className='h-4 w-4' />
                    Back to Cover Letters
                </Button>
            </Link>
            <div>
                <h1 className='text-6xl font-bold gradient-title'>{coverLetterContent?.JobTitle} at {coverLetterContent?.companyName}</h1> 
            </div>
        </div>
        <MarkDown content={coverLetterContent?.content??""}/>
    </div>
  )
}

export default CoverLetterMarkdown