'use client';

import { useEffect, useState } from "react";
import { getForm, getResponses, Form } from "@/lib/data"
import { StatCard } from "@/components/dashboard/stat-card"
import { ResponsesTable } from "@/components/forms/responses-table"
import { BarChart, Check, Clock, User } from "lucide-react"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton";

export default function FormResponsesPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadForm() {
      setIsLoading(true);
      const formFromDb = await getForm(params.id);
      if (!formFromDb) {
        notFound();
      }
      setForm(formFromDb);
      setIsLoading(false);
    }
    loadForm();
  }, [params.id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-5 w-1/3 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!form) {
    // This should ideally not be reached if notFound() works as expected
    return notFound();
  }
  
  // Mock data for demo - you might want to calculate this from actual responses
  const completionRate = 85.3
  const avgTime = "2m 15s"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{form.name}</h1>
        <p className="text-muted-foreground">Viewing responses for your form.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Responses" value={form.responses} icon={BarChart} />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={Check} />
        <StatCard title="Avg. Time" value={avgTime} icon={Clock} />
        <StatCard title="Unique Respondents" value={form.responses} icon={User} />
      </div>

      <ResponsesTable formId={form.id} questions={form.questionsData || []} />
    </div>
  )
}
