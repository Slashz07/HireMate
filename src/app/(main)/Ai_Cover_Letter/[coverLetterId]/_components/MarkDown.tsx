"use client"
import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'

function MarkDown({content}:{content:string}) {
    const [markDownContent,setMarkDownContent]=useState(content)
  return (
    <div>
        <MDEditor value={markDownContent} onChange={(val)=>setMarkDownContent(val||"")} height={800} preview='edit'/>
    </div>
  )
}

export default MarkDown