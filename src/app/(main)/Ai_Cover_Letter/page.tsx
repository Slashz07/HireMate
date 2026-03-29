import { CoverLetter } from '@prisma/client'
import { getCoverLetters } from '@/actions/coverLetters'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CoverLettersList from './_components/CoverLettersList'


async function MyCoverLetters() {
    const coverLetters: CoverLetter[] = await getCoverLetters()
    console.log("Cover letters: ", coverLetters)
  

  return (
    <div>

      <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
        <h1 className='text-5xl font-bold gradient-title md:text-6xl my-4'> My Cover Letters
        </h1>
        <div className='space-x-2'>
          <Link href={"/Ai_Cover_Letter/new"}>
            <Button variant={'outline'}  >
              <Plus className='h-4 w-4 black' />
              Create New
            </Button>
          </Link>

        </div>
      </div>
      <CoverLettersList list={coverLetters}/>
    </div>

  )
}

export default MyCoverLetters