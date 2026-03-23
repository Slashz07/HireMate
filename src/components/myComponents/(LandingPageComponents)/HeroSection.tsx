"use client"
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from '../../ui/button'
import Image from 'next/image'


function HeroSection() {

    const imgRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const img = imgRef.current

        const getScrolPos = () => {
            const scrollPosition = window.scrollY
            const scrollThreshold = 100

            if (scrollPosition > scrollThreshold) {
                img?.classList.add('scrolled')
            } else {
                img?.classList.remove("scrolled");
            }
        }
        window.addEventListener('scroll', getScrolPos)

        return () => window.removeEventListener("scroll", getScrolPos)
    }, [])

    return (
        <div className='px-2'>
            <div className='space-y-6 text-center mb-5'>
                <div className='space-y-6'>
                    <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title '>
                        Your AI Career Coach for <br />
                        Professional Success
                    </h1>
                    <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                        Advance your career with personalised guidance, interview prep ,and AI powered tools for job success
                    </p>
                </div>
                <div className='flex justify-center space-x-4'>
                    <Link href={'/dashBoard'}>
                        <Button size={'lg'} className='px-8'>
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
            <div className='hero-image-wrapper mt-5 md:mt-0'>
                <div ref={imgRef} className='hero-image'>
                    <Image src={"/heroImg.png"} width={1280} height={720} alt='HIREMATE' className='rounded-lg shadow-2xl border mx-auto ' priority />
                </div>
            </div>
        </div>
    )
}

export default HeroSection