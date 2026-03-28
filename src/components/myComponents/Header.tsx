export const dynamic = "force-dynamic";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, LucideIcon, PenBox, StarsIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button';
import {CheckUser} from '@/lib/CheckUser'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MenuItems{
    label:string,
    icon:LucideIcon,
    href:string
}

const menuItems:MenuItems[]=[
    {
        label:"Build Resume",
        icon:FileText,
        href:"/resume"
    }, 
    {
        label:"Cover Letter",
        icon:PenBox,
        href:"/Ai_Cover_Letter"
    },
     {
        label:"Interview Prep",
        icon:GraduationCap,
        href:"/interview"
    },
]

const Header = async () => {
    await CheckUser()
    return (
        <nav className='flex justify-between fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60 border-b border-white/10'>
            <div className='flex gap-4 container px-4 h-25  items-center'>
                <Link href={'/'}>
                    <Image alt="HireMate"
                        width={200}
                        height={60}
                        src='/Logo.png'
                        className='h-22 py-1 object-contain w-auto'
                    />
                </Link>
                <div className='flex gap-2 md:space-x-4'>
                    <SignedIn>
                        <Link href={'/dashBoard'}>

                            <Button className=''>
                                <LayoutDashboard className='h-4 w-4 mx-2' />
                                <p className='hidden md:block '> Industry Insights</p>
                            </Button>
                        </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant={'outline'}>
                                <StarsIcon className='h-4 w-4 mx-2'/>
                                <span className='hidden md:block px-1.5 '>Growth tools</span>
                                <ChevronDown className='h-4 w-4'/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                            {
                                menuItems.map((item,idx)=>{
                                    const Icon=item.icon
                                    return (
                                     <DropdownMenuItem key={idx}>
                                        <Link className='flex gap-1 my-2' href={item.href}>
                                            <Icon className="h-4 w-4 mx-2"/>
                                            <span className='hidden md:block'>{item.label}</span>
                                        </Link>
                                     </DropdownMenuItem>
                                        
                                    )
                                })
                            }
                            
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </SignedIn>

                </div>
            </div>

            <div className='flex flex-1 justify-end items-center p-4 gap-4 h-25'>
                <SignedOut>
                    <SignInButton >
                            <Button variant={'outline'}>
                                SignIn
                            </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button variant={'outline'}>
                                SignUp
                        </Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton
                    appearance={{
                        elements:{
                            avatarBox:"w-10 h-10",
                            userButtonPopoverCard:"shadow-xl",
                            userPreviewMainIdentifier:"font-semibold"
                        }
                    }}
                    afterSignOutUrl='/'
                    />
                </SignedIn>
            </div>
        </nav>


    )
}

export default Header