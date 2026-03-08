"use client"
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Quiz from '../_components/Quiz'
import { useRouter } from 'next/navigation'

function MockInterview() {
    const router=useRouter()
  return (
    <div className='container mx-auto space-y-4 py-6'>
        <div className='flex flex-col space-y-2 mx-2'>
            <div onClick={()=>router.push(".")}>
                <Button className='gap-2 pl-0'>
                    <ArrowLeft  className='h-4 w-4' />
                    Back to Interview preparation
                </Button>
            </div>
            <div>
                <h1 className='text-6xl font-bold gradient-title'>Mock Interview</h1>
                <p className='text-muted-foreground'>
                    Text your knowledge with industry-specific questions 
                </p>
            </div>
        </div>
        <Quiz/>
    </div>
  )
}

export default MockInterview