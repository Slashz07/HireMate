"use client"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CoverLetter } from '@prisma/client'
import { format } from 'date-fns'
import { Eye,  Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function MyCoverLetter({ letterData,deleteCoverLetter }:{letterData:CoverLetter,deleteCoverLetter:(id: string) => Promise<void>}) {
  const date=format(letterData.createdAt,"MMMM do yyyy")
  return (
    <div className='space-y-2 my-3'>
      <Card>
        <CardHeader>
          <CardTitle>{letterData.JobTitle} at {letterData.companyName}</CardTitle>
          <CardDescription>Created {date}</CardDescription>
          <CardAction >
            <Button className='mr-2' variant={"outline"}>
              <Link href={`/Ai_Cover_Letter/${letterData.id}`}>
              <Eye/>
              </Link>
            </Button>
            <Button variant={"outline"} onClick={()=>deleteCoverLetter(letterData.id)}>
              <Trash2/>
            </Button>
          </CardAction>
        </CardHeader>
        {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        <CardFooter>
          <p>{letterData.jobDescription}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default MyCoverLetter