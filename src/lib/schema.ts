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