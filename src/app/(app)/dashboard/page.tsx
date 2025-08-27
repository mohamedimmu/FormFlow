import { StatCard } from '@/components/dashboard/stat-card'
import { RecentForms } from '@/components/dashboard/recent-forms'
import { forms } from '@/lib/data'
import { FileText, MessageSquare, BarChart2, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const totalForms = forms.length
  const totalResponses = forms.reduce((sum, form) => sum + form.responses, 0)
  const activeForms = forms.filter(form => form.status === 'Active').length
  const avgResponses = totalResponses / totalForms

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Forms" value={totalForms} icon={FileText} />
        <StatCard title="Total Responses" value={totalResponses} icon={MessageSquare} />
        <StatCard title="Active Forms" value={activeForms} icon={CheckCircle} />
        <StatCard title="Avg. Responses" value={avgResponses.toFixed(1)} icon={BarChart2} />
      </div>
      <div>
        <RecentForms />
      </div>
    </div>
  )
}
