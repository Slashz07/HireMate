import { z } from "zod"

export const onBoardingSchema = z.object({
    industry: z.string().min(1, "Please select an industry"),
    subIndustry: z.string().min(1, "Please select a sub-industry"),
    bio: z.string().max(500).optional(),
    experience: z.coerce.number().min(0, "Experience must be greater than equal to 0 years")
            .max(50, "Experience cannot exceed 50 years")
    ,
    skills: z.string().trim().min(1,"Atleast provide one skill").transform((val) => val ? val.split(',').map((skill) => skill.trim()).filter(Boolean) : [])
})

export const contactSchema=z.object({
    email:z.email("Invalid email address"),
    mobile:z.string().optional(),
    linkedin:z.string().optional(),
    twitter:z.string().optional(),
})

export const entrySchema=z.object({
    title:z.string().min(1,"Title is required"),
    organization:z.string().min(1,"Organization is required"),
    description:z.string().min(1,"description is required"),
    startDate:z.string().min(1,"Start date is required"),
    endDate:z.string().optional(),
    current:z.boolean().optional()
}).refine((data)=>{
    if(!data.endDate&&!data.current){
        return false//this way we throw the error suggesting to fill either of the entries
    }
    return true
},{
    message:"You must select an end date unless this is your current job",
    path:["endDate"]//this ensures the error statement defined above is displayed beneath endDate in the form
})

export const resumeSchema=z.object({
    contactInfo:contactSchema,
    summary:z.string().min(1,"Minimum one summary is required"),
    skills:z.string().min(1,"Minimum one skill is required"),
    experience:z.array(entrySchema),
    projects:z.array(entrySchema),
    education:z.array(entrySchema),
})