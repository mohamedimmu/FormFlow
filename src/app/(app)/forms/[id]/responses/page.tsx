import { StatCard } from "@/components/dashboard/stat-card"
import { ResponsesTable } from "@/components/forms/responses-table"
import { forms } from "@/lib/data"
import { BarChart, Check, Clock, User } from "lucide-react"
import { notFound } from "next/navigation"

export default function FormResponsesPage({ params }: { params: { id: string } }) {
  const form = forms.find(f => f.id === params.id)
  if (!form) {
    notFound()
  }

  // Mock data for demo
  const completionRate = 85.3
  const avgTime = "2m 15s"
  const uniqueRespondents = form.responses

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
        <StatCard title="Unique Respondents" value={uniqueRespondents} icon={User} />
      </div>

      <ResponsesTable />
    </div>
  )
}
