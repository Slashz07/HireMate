"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { entrySchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/fetch-hook/useFetch";
import { improveWithAi } from "@/actions/resume";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parse } from "date-fns";
import { entrySchemaType } from "./ResumeBuilder";

const EntryForm = ({ type, enteries, onChange }:{type:string,enteries:entrySchemaType[],onChange:(updatedEntries: entrySchemaType[]) => void}) => {
  const {
    register,
    handleSubmit: handleValidation,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const formatDisplayDate = (displayDate: string) => {
    if (!displayDate) return ""
    const date = parse(displayDate, "yyyy-MM", new Date())
    return format(date, "MMM yyyy")
  }

  const {
    loading: isImproving,
    fetchData: improveWithAiFn,
    data: improvedData,
    error: improveError,
  } = useFetch(improveWithAi);

  useEffect(() => {
    if (improvedData) {
      setValue("description", improvedData);
      toast.success("Description improved successfully");
    }
  }, [improvedData]);

  const handleDescriptionImprove = async () => {
    const desc = watch("description");
    const org = watch("organization");
    console.log("Org: ", org);
    if (!desc || !org) {
      !desc
        ? toast.error("Please enter a description first")
        : !org
          ? toast.error("Please enter your organization first")
          : "";
      return;
    }

    await improveWithAiFn({
      current: desc,
      type: type.toLowerCase(),
      org,
    });

    if (improveError) {
      console.log("Error improving with ai: ", improveError);
      toast.error("Error while improving!");
    }
  };

    const handleDelete=(ind:number)=>{
        const newEntries=enteries.filter((_,idx:number)=>idx!=ind)
        onChange(newEntries)
    }

  const [isAdding, setIsAdding] = useState(false);
  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate as string)
    }
    console.log("Added entry: ",formattedEntry)
    onChange([...enteries, formattedEntry])

    reset()
    setIsAdding(false)
  })

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {
          enteries.map((item, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}@{item.organization}
                </CardTitle>
                <Button
                type="button"
                variant={"outline"}
                size={"icon"}
                onClick={()=>handleDelete(idx)}
                >
                  <X className="h-4 w-4"/>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                    {
                      item.current
                        ?`${item.startDate} - Present`
                        :`${item.startDate} - ${item.endDate}`
                    }
                </p>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))
        }
      </div>
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 mb-3">
                <Input
                  placeholder="Title/Position"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="organization/Company"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-red-500 text-sm">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="startDate"
                  type="month"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="endDate"
                  type="month"
                  disabled={current}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 mb-4">
              <Checkbox
                id="current"
                checked={watch("current")}
                onCheckedChange={(checked) => {
                  setValue("current", checked as boolean);
                  if (checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <Label htmlFor="current">Current {type}</Label>
            </div>
            <div>
              <Textarea
                className="h-32"
                placeholder={`Description of your ${type.toLowerCase()}`}
                {...register("description")}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDescriptionImprove}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
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
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          variant={"outline"}
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
