import Image from 'next/image'
import React from 'react'
import { Card, CardContent } from '../ui/card'

interface reviewCard {
    name: string,
    position: string,
    company: string,
    userImg: string,
    review: string
}

function ReviewCard({ name, position, company, userImg, review }: reviewCard) {
    return (
        <Card className='min-w-18 border-2 '>
            <CardContent className='flex flex-col'>
                <div className='flex mb-5 gap-5 items-center'>
                    <span >
                        <Image height={40} width={40} src={userImg} alt={name} className='rounded-full object-cover border-2 border-primary/20' />
                    </span>
                    <div className=''>
                        <h1>{name}</h1>
                        <p className='text-muted-foreground'>{position}</p>
                        <p>{company}</p>
                    </div>
                </div>
                <div>
                    <p className='text-muted-foreground relative italic'>
                        <span className='text-3xl text-primary absolute -top-4 -left-3'>
                            &quot;
                        </span>
                            {review}
                        <span className='text-3xl text-primary absolute -bottom-4'>
                            &quot;
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default ReviewCard