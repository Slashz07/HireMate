"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Assessment } from '@prisma/client'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function PerformanceCharts({ assessments }:{assessments:Assessment[]}) {
    const [chartData, setChartData] = useState<{date:string,score:number}[]>([])
    useEffect(() => {
        if (assessments) {
            const formattedData = assessments.map((assessment) => {
                return {
                    date: format(new Date(assessment.createdAt), "MMM dd, HH:mm"),
                    score: assessment.quizScore
                }
            })
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setChartData(formattedData)
        }
    }, [assessments])
    return (
        <div >
            <Card>
                <CardHeader >
                    <CardTitle className='gradient-title text-3xl md:text-4xl'>Performance Trend</CardTitle>
                    <CardDescription>Your Quiz scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload?.length) {
                                            return (
                                                <div className="bg-background border rounded-lg p-2 shadow-md">
                                                    <p className="text-sm font-medium">
                                                        Score: {payload[0].value}%
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {payload[0].payload.date}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke='#8884d8'
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PerformanceCharts