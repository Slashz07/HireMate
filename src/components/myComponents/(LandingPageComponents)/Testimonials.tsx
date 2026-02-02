import React from 'react'
import ReviewCard from '../ReviewCard'

function Testimonials() {
    const reviewList=[
        {
            name:"Sarah Chen",
            position:"Software Engineer",
            review:"The ai-powered  interview-prep was a game changer. Landed my dream job at a big tech company",
            company:"Tech giant co.",
            userImg:"https://randomuser.me/api/portraits/women/75.jpg"
        },{
            name:"Micheal Rodriguez",
            position:"Data scientist",
            review:"The industry insights helped me pivot my career successfully.The salary data was spot on!",
            company:"Startup Inc.",
            userImg:"https://randomuser.me/api/portraits/men/75.jpg"
        },{
            name:"Martin",
            position:"Backend Engineer",
            review:"My Resume's ATS score improved significantly.Got more interviews in two weeks than in six months!",
            company:"Grow Infra.",
            userImg:"https://randomuser.me/api/portraits/men/77.jpg"
        },
    ]
  return (
    <div className='container mx-auto px-4 md:px-6 '>
        <h1 className='text-4xl font-bold mb-12 tracking-tighter text-center'>
            What our Users say
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
            {
                reviewList.map((rv,idx)=>(
                    <ReviewCard key={idx} {...rv}/>
                ))
            }
        </div>
    </div>
  )
}

export default Testimonials