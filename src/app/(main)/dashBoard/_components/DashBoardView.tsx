"use client"
import { SalaryRange } from '@/actions/user'
import { IndustryInsights } from '@prisma/client'
import { Brain, Briefcase, LineChart, TrendingDown, TrendingUp } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
function DashBoardView({ insights }: { insights: IndustryInsights }) {

  const salaryRanges = insights.salaryRanges as SalaryRange[]//needed typecasting of dalaryRanges as the database returns it as JSON[] and so although it expects an array of objects,it doesnt remember what type of objects

  const salaryData = salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000
  }))

  const getDemandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const marketOutlookInfo = (outLook: string) => {
    switch (outLook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" }
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" }
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" }
      default:
        return { icon: LineChart, color: "text-gray-500" }
    }
  }

  const OutLookIcon = marketOutlookInfo(insights.marketOutlook).icon
  const OutLookColor = marketOutlookInfo(insights.marketOutlook).color
  const lastUpdate = format(new Date(insights.lastUpdate), "dd/MM/yy")
  const nextUpdate = formatDistanceToNow(
    new Date(insights.nextUpdate), { addSuffix: true }
  )

  return (
    <div className='space-y-6'>
      <div className='  '>
        <Badge variant="outline">Last Updated: {lastUpdate}</Badge>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <Card>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Market Outlook</CardTitle>
            <OutLookIcon className={`h-4 w-4 ${OutLookColor}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{insights.marketOutlook}</div>
            <p className='text-xs text-muted-foreground'>
              Next Update {nextUpdate}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Industry Growth</CardTitle>
            <TrendingUp className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{insights.growthRate.toFixed(1)}%</div>
            <Progress value={insights.growthRate} className='mt-2' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Demand Level</CardTitle>
            <Briefcase className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{insights.demandLevel}</div>
            <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>
        <Card className='flex flex-col justify-around'>
          <CardHeader className='flex flex-row justify-between'>
            <CardTitle>Top Skills</CardTitle>
            <Brain className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-1'>
              {
                insights.topSkills.map((skill, idx) => (
                  <Badge key={idx} variant={'secondary'}>{skill}</Badge>
                ))
              }
            </div>

          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>Displaying minimum, median and maximum salaries(in thousands)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[400px]'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salaryData}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={({ label, payload, active }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className='bg-background rounded-lg border p-2 shadow-md'>
                        <p className='font-medium'>{label}</p>
                        {
                          payload.map((data, idx) => (
                            <p key={idx} className='text-sm'>
                              {`${data.name} :  ${data.value}K`}
                            </p>
                          ))
                        }
                      </div>
                    )
                  }
                  return null
                }} />
                <Legend />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>

      </Card>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>Current Trends shaping the industry</CardDescription>
          </CardHeader>
          <CardContent>
              <ul>
                {
                  insights.keyTrends.map((trend)=>(
                    <li className='flex items-start space-x-2 mb-2' key={trend}>
                      <div className='h-2 w-2 mt-2 rounded-full bg-primary'></div>
                      <span>{trend}</span>
                      </li>
                  ))
                }
              </ul>
          </CardContent>

        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommended skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
                  {
                  insights.recommendedSkills.map((skill)=>(
                    <Badge variant={'outline'} key={skill} >{skill}</Badge>
                  ))
                }
            </div>
                
          </CardContent>

        </Card>
      </div>


    </div>
  )
}

export default DashBoardView
