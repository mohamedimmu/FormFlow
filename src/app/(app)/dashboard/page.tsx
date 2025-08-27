'use client';

import { StatCard } from '@/components/dashboard/stat-card'
import { RecentForms } from '@/components/dashboard/recent-forms'
import { getForms } from '@/lib/data'
import { FileText, MessageSquare, BarChart2, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    activeForms: 0,
    avgResponses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
        setIsLoading(true);
        try {
            const forms = await getForms();
            if (forms.length > 0) {
                const totalForms = forms.length;
                const totalResponses = forms.reduce((sum, form) => sum + form.responses, 0);
                const activeForms = forms.filter(form => form.status === 'Active').length;
                const avgResponses = totalForms > 0 ? totalResponses / totalForms : 0;
                
                setStats({
                    totalForms,
                    totalResponses,
                    activeForms,
                    avgResponses,
                });
            } else {
                setStats({ totalForms: 0, totalResponses: 0, activeForms: 0, avgResponses: 0 });
            }
        } catch (error) {
            console.error("Failed to load dashboard stats:", error);
            // Handle error state if necessary, e.g., show a toast notification
        } finally {
            setIsLoading(false);
        }
    }
    loadStats();
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Forms" value={stats.totalForms} icon={FileText} isLoading={isLoading} />
        <StatCard title="Total Responses" value={stats.totalResponses} icon={MessageSquare} isLoading={isLoading} />
        <StatCard title="Active Forms" value={stats.activeForms} icon={CheckCircle} isLoading={isLoading} />
        <StatCard title="Avg. Responses" value={stats.avgResponses.toFixed(1)} icon={BarChart2} isLoading={isLoading} />
      </div>
      <div>
        <RecentForms />
      </div>
    </div>
  )
}
