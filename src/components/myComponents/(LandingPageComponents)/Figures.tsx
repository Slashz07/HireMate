
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'

function Figures() {
    const [startCount, setStartCount] = useState(false)
    const myFigures = [
        {
            count: 50,
            service: "Industries covered"
        }, {
            count: 1000,
            service: "Interview Questions"
        }, {
            count: 95,
            service: "Success Rate"
        }, {
            count: 24,
            service: "AI support"
        },
    ]

    useEffect(() => {
        const scrollThreshold = 1300
        const startCounter = () => {
            const scrollPos = window.scrollY
            if (scrollPos > scrollThreshold) {
                setStartCount(true)
            }
        }
        window.addEventListener('scroll',startCounter)
        return ()=> window.removeEventListener('scroll',startCounter)
    })

    return (
        <div className='container mx-auto px-4 md:px-6 text-center'>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
                {
                    myFigures.map((figure, idx) => (
                        <div key={idx} className='flex flex-col items-center'>
                            {startCount ?
                                <h1 className='text-bold text-3xl'>
                                    <CountUp duration={5} end={figure.count} />
                                    {figure.service == "Success Rate" ? "%" : figure.service == "AI support" ? "/7" : "+"}
                                </h1>
                                :
                                <h1 className='text-bold text-3xl'>0{figure.service == "Success Rate" ? "%" : figure.service == "AI support" ? "/7" : "+"}</h1>

                            }
                            <p>{figure.service}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Figures