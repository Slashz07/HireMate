import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='relative top-25 px-5'>
      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='gray' />}>
        {children}
      </Suspense>
    </div>
  )
}

export default layout