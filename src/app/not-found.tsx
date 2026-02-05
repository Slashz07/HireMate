import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function notFound() {
    return (
        <div className='w-full'>
            <div className='container mx-auto py-52'>
                <div className='text-center flex flex-col gap-y-5 items-center'>
                    <h1 className='text-5xl font-bold text-muted-foreground '>404</h1>
                    <h2 className='text-xl'>Page Not Found</h2>
                    <p className='text-muted-foreground'>Oops!The page you&apos;re looking for doesn&apos;t exist or has been moved</p>
                    <Link href={'/'}>
                        <Button>Return Home</Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default notFound