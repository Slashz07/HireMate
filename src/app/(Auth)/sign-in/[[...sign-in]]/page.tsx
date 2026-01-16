"use client"
import { SignIn } from '@clerk/nextjs'
import React from 'react'

function signin() {
  return (
    <div>
      <SignIn/>
    </div>
  )
}

export default signin