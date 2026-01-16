import React from 'react'

function Layout({children,}:Readonly<{children:React.ReactNode}>) {
  return (
    <div className='pt-40 flex justify-center'>
        {children}
    </div>
  )
}

export default Layout