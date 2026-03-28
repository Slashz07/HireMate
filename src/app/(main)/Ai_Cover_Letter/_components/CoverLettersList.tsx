"use client"
import React, { useState } from 'react'
import MyCoverLetter from './MyCoverLetter'
import { deleteCoverLetter } from '@/actions/coverLetters'
import { toast } from 'sonner'

function CoverLettersList({ list }) {
    const [CoverLettersList, setCoverLettersList] = useState(list || [])
    

    const handleDelete = async (id: string) => {
        const updatedCoverLettersList = CoverLettersList.filter((cvl) => cvl.id != id)
        setCoverLettersList(updatedCoverLettersList)

        await deleteCoverLetter(id)
        toast.success("Cover letter deleted successfully")
    }
    return (
        <div className='mt-4 md:mt-0'>
            {
                CoverLettersList.map((cvl, idx) => (
                    <MyCoverLetter key={idx} letterData={cvl} deleteCoverLetter={handleDelete} />
                ))
            }
        </div>
    )
}

export default CoverLettersList