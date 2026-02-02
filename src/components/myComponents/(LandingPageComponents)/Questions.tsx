import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqs } from '@/data/faqs'


function Questions() {
    return (
        <div className='container mx-auto px-4 md:px-6'>
            <div className='text-center mb-12'>
                <h1 className='text-3xl font-bold mb-5 tracking-tighter'>
                    Frequently Asked Questions
                </h1>
                <p className='text-muted-foreground '>Find answers to common questions on our platform</p>
            </div>
            <div className='max-w-6xl mx-auto'>
                <Accordion
                    type="single"
                    collapsible
                    defaultValue="ques0"
                    className="w-full py-2 px-4"
                >
                    {
                        faqs.map((faq,idx)=>(
                            <AccordionItem className='w-full' key={idx} value={`ques${idx}`}>
                              <AccordionTrigger>{faq.question}</AccordionTrigger>
                              <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </div>
        </div>
    )
}

export default Questions