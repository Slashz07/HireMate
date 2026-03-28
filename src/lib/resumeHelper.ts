import { entrySchemaType } from '@/app/(main)/resume/_components/ResumeBuilder'
import React from 'react'

const enteriesToMarkdown = (enteries: entrySchemaType[], type: string) => {

  return (
    `## ${type}\n\n` +
    enteries.map((entry: entrySchemaType, idx: number) => {
      const dateRange = entry.current
        ? `${entry.startDate} - Present`
        : `${entry.startDate} - ${entry.endDate}`
      return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`
    }).join("\n\n")
  )
}

export default enteriesToMarkdown