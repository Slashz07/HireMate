"use client"
import { improveSummaryWithAi, saveResume } from '@/actions/resume'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/fetch-hook/useFetch'
import { contactSchema, entrySchema, resumeSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import EntryForm from './EntryForm'
import { useUser } from '@clerk/nextjs'
import enteriesToMarkdown from '@/lib/resumeHelper'
import MDEditor, { PreviewType } from '@uiw/react-md-editor'
// import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

import { toast } from 'sonner'
import z from 'zod'

export type entrySchemaType = z.infer<typeof entrySchema>;
export type contactSchemaType = z.infer<typeof contactSchema>;
export type resumeSchemaType = z.infer<typeof resumeSchema>;
const ResumeBuilder = ({ initialContent }:{initialContent:resumeSchemaType|null}) => {

  const [activeTab, setActiveTab] = useState('edit')
  const [resumeMode, setResumeMode] = useState<PreviewType>("preview")
  const [previewContent, setPreviewContent] = useState("")
  const [isgeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false)
  const resumeRef = useRef<HTMLDivElement>(null)
  const { register,setValue, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: initialContent?.contactInfo ?? { email: "" },
      summary: initialContent?.summary??"",
      skills: initialContent?.skills??"",
      experience: initialContent?.experience??[],
      education: initialContent?.education??[],
      projects: initialContent?.projects??[]
    }
  })

  const formValues = watch()//provides all values in the form
  const { user, isLoaded } = useUser()
const initialPreviewGenerated = useRef(false)

  const {
    data: saveResult,
    fetchData: saveResumeFn,
    loading: savingResume,
    error: saveError,
  } = useFetch(saveResume)

  useEffect(() => {
    if (initialContent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("preview")
      
    }
  }, [initialContent])

useEffect(() => {
    if (!isLoaded) return;
    
    if (activeTab === "edit" || !initialPreviewGenerated.current) {
      const data = handlePreviewContent()
      setPreviewContent(data)
      initialPreviewGenerated.current = true // Mark that the initial load is done
    }
  }, [activeTab, formValues, isLoaded, user])

  const getContactMarkdownValues = () => {
    const { contactInfo } = formValues
    const parts = []
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`)
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`)
    if (contactInfo.linkedin) parts.push(`🔗 (${contactInfo.linkedin})`)
    if (contactInfo.twitter) parts.push(`𝕏 (${contactInfo.twitter})`)

    return parts.length > 0
      ? `## <div align="center" >${user?.fullName}</div>
          \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>
          `: ""
  }

  const handlePreviewContent = () => {
    const { summary, skills, experience, education, projects } = formValues

    return [
      getContactMarkdownValues(),
      summary && `## Professional Summary\n\n ${summary}`,
      skills && `## Skills\n\n ${skills}`,
      enteriesToMarkdown(experience, "Experience"),
      enteriesToMarkdown(education, "Education"),
      enteriesToMarkdown(projects, "Project")
    ].filter(Boolean).join("\n\n")

  }
  const generatePdf = async () => {
    setIsGeneratingPdf(true)
    try {
      // Dynamically import html2pdf
      const html2pdfModule = await import("html2pdf.js/dist/html2pdf.min.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const elem = resumeRef.current
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          onclone: (clonedDoc: Document) => {
            
            // 1. SAFEGURARD: Strip unsupported colors from style tags
            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach((style) => {
              if (style.innerHTML.includes('lab(') || style.innerHTML.includes('oklch(')) {
                // Replace modern color functions with standard black hex to prevent parsing crashes
                style.innerHTML = style.innerHTML.replace(/lab\(.*?\)/g, '#000000');
                style.innerHTML = style.innerHTML.replace(/oklch\(.*?\)/g, '#000000');
              }
            });

            // 2. CRITICAL FIX: Target both HTMLElements AND SVGElements
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: Element) => {
              if (el instanceof HTMLElement || el instanceof SVGElement) {
                el.style.setProperty('color', '#000000', 'important');
                el.style.setProperty('background-color', 'transparent', 'important');
                el.style.setProperty('border-color', '#cccccc', 'important');
                el.style.setProperty('text-decoration-color', '#000000', 'important');
                
                // Override SVG specific properties that cause the SVGElementContainer crash
                el.style.setProperty('fill', '#000000', 'important');
                el.style.setProperty('stroke', '#000000', 'important');
              }
            });

            // 3. Ensure the main background is solid white
            const container = clonedDoc.getElementById('pdf-resume-wrapper');
            if (container) {
              container.style.setProperty('background-color', '#ffffff', 'important');
            }
            if (clonedDoc.body) {
              clonedDoc.body.style.setProperty('background-color', '#ffffff', 'important');
            }
          }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      }

      await html2pdf().set(opt).from(elem).save()
      toast.success("Resume downloaded!")
    } catch (error) {
      console.log("error generating pdf: ", error)
      toast.error("Error generating pdf")
    } finally {
      setIsGeneratingPdf(false)
    }
  }
   const {
      loading: improvingSummary,
      fetchData: improveSummaryWithAiFn,
      data: improvedSummary,
      error: improveSummaryError,
    } = useFetch(improveSummaryWithAi);
  

   useEffect(() => {
      if (improvedSummary) {
        setValue("summary", improvedSummary);
        toast.success("Summary improved successfully");
      }
    }, [improvedSummary]);
  
    const handleSummaryImprove = async () => {
      const summary = watch("summary");
      if (!summary) {
          toast.error("Please enter your professional summary first")
          return;
      }
  
      await improveSummaryWithAiFn({
        current: summary
      });
  
      if (improveSummaryError) {
        console.log("Error improving summary with ai: ", improveSummaryError);
        toast.error("Error while improving the summary!");
      }
    };

  const handleResume = async (data:resumeSchemaType) => {
    try {
      console.log("submitted data: ",data)
      const res=await saveResumeFn(data)
      console.log("response: ",res)
    } catch (error) {
      console.log("error saving resume: ",error)
    }
  }

  useEffect(()=>{
    if(savingResume){
      // toast.loading("Saving...")
    }else if(saveResult){
      toast.success("Saved!")
    }
    if(saveError){
      toast.error(saveError)
    }
  },[saveError,saveResult,savingResume])

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
        <h1 className='text-5xl font-bold gradient-title md:text-6xl'> Resume Builder</h1>
        {
     <div className='space-x-2'>
            <Button variant={'destructive'} onClick={handleSubmit(handleResume)} disabled={savingResume}>
              {
                savingResume ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Saving resume...
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4' />
                    Save
                  </>
                )
              }

            </Button>
           {
                 activeTab == "preview" && <Button disabled={isgeneratingPdf} onClick={generatePdf} >
              {
                isgeneratingPdf ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className='h-4 w-4' />
                    Download Pdf
                  </>
                )
              }

            </Button>
           } 
          </div>
        }
      </div>
      <Tabs defaultValue="edit" value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className='space-y-8'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Contact Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounder-lg bg-muted/50'>
                <div className='space-y-2'>
                  <label htmlFor="contactInfo-email" className='text-sm font-medium'>Email</label>
                  <Input
                    id='contactInfo-email'
                    {...register("contactInfo.email")}
                    type='email'
                    placeholder='Enter mail-id'
                  // error={errors.contactInfo?.email}
                  />
                  {
                    errors.contactInfo?.email && (
                      <p className='text-sm text-red-500'>
                        {errors.contactInfo.email?.message}
                      </p>
                    )
                  }
                </div>
                <div className='space-y-2'>
                  <label htmlFor="contactInfo-email" className='text-sm font-medium'>Mobile number</label>
                  <Input
                    id='contactInfo-mobile'
                    {...register("contactInfo.mobile")}
                    type='tel'
                    placeholder='+91 123 456 7890'
                  // error={errors.contactInfo?.email}
                  />
                  {
                    errors.contactInfo?.mobile && (
                      <p className='text-sm text-red-500'>
                        {errors.contactInfo.mobile?.message}
                      </p>
                    )
                  }
                </div>
                <div className='space-y-2'>
                  <label htmlFor="contactInfo-linkedin" className='text-sm font-medium'>Linkedin</label>
                  <Input
                    id='contactInfo-linkedin'
                    {...register("contactInfo.linkedin")}
                    type='url'
                    placeholder='https://linkedin.com/in/your-profile'
                  // error={errors.contactInfo?.email}
                  />
                  {
                    errors.contactInfo?.linkedin && (
                      <p className='text-sm text-red-500'>
                        {errors.contactInfo.linkedin?.message}
                      </p>
                    )
                  }
                </div>
                <div className='space-y-2'>
                  <label htmlFor="contactInfo-email" className='text-sm font-medium'>Twitter/X profile</label>
                  <Input
                    id='contactInfo-twitter'
                    {...register("contactInfo.twitter")}
                    type='url'
                    placeholder='https://X.com/your-handle'
                  // error={errors.contactInfo?.email}
                  />
                  {
                    errors.contactInfo?.twitter && (
                      <p className='text-sm text-red-500'>
                        {errors.contactInfo.twitter?.message}
                      </p>
                    )
                  }
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-medium'>Professional Summary</h3>
              <Controller
                control={control}
                name='summary'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    //field object contains the useForm methods which are then provided as props here.eg->
                    // {
                    //   name: "summary",
                    //   value: formValues.summary,
                    //   onChange: handleChangeFromForm,
                    //   onBlur: handleBlurFromForm,
                    //   ref: inputRef
                    // }
                    // since TextArea uses methods like name,value,onBlur etc,it then uses these prop methods which effectively update the useForm and the TextArea(as its value is also provided by useForm thorugh props)
                    className='h-32'
                    placeholder='Write a compelling professional summary...'
                  />
                )}
              />
              {
                errors.summary && <p className='text-sm text-red-500'>
                  {errors.summary.message}
                </p>
              }
            </div>
            <div>
              <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSummaryImprove}
              disabled={improvingSummary || !watch("summary")}
            >
              {improvingSummary? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
            </div>
            <div>
              <h3 className='text-lg font-medium'>Skills</h3>
              <Controller
                control={control}
                name='skills'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className='h-32'
                    placeholder='List your key skills...'
                  />
                )}
              />
              {
                errors.skills && <p className='text-sm text-red-500'>
                  {errors.skills?.message}
                </p>
              }
            </div>
            <div>
              <h3 className='text-lg font-medium'>Experience</h3>
              <Controller
                control={control}
                name='experience'
                render={({ field }) => (
                  <EntryForm
                    enteries={field.value}
                    type="Experience"
                    onChange={field.onChange}
                  />
                )}
              />
              {
                errors.experience && <p className='text-sm text-red-500'>
                  {errors.experience?.message}
                </p>
              }
            </div>
            <div>
              <h3 className='text-lg font-medium'>Education</h3>
              <Controller
                control={control}
                name='education'
                render={({ field }) => (
                  <EntryForm
                    enteries={field.value}
                    type="Education"
                    onChange={field.onChange}
                  />
                )}
              />
              {
                errors.education && <p className='text-sm text-red-500'>
                  {errors.education?.message}
                </p>
              }
            </div>
            <div>
              <h3 className='text-lg font-medium'>Projects</h3>
              <Controller
                control={control}
                name='projects'
                render={({ field }) => (
                  <EntryForm
                    enteries={field.value}
                    type="Project"
                    onChange={field.onChange}
                  />
                )}
              />
              {
                errors.projects && <p className='text-sm text-red-500'>
                  {errors.projects?.message}
                </p>
              }
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant={"link"}
            type='button'
            className='mb-2'
            onClick={() => setResumeMode(resumeMode == "preview" ? "edit" : "preview")}
          >
            {
              resumeMode == "preview" ? (
                <>
                  <Edit className='h-4 w-4' />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className='h-4 w-4' />
                  Show Preview
                </>
              )
            }

          </Button>
          {
            resumeMode == "edit" && (
              <div className='flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2'>
                <AlertTriangle className='h-5 w-5' />
                <span className='text-sm'>
                  You will lose edited markdown if you update the form data
                </span>
              </div>
            )
          }
          <div className='border rounded-lg'>
            <MDEditor value={previewContent} onChange={(val) => setPreviewContent(val || "")}
              height={800} preview={resumeMode}
            />
          </div>
          <div className="absolute -left-[9999px] top-0">
            <div ref={resumeRef} >
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black"
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResumeBuilder