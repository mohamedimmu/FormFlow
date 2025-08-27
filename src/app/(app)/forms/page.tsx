import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { FormsTable } from "@/components/forms/forms-table"

export default function FormsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
        <Link href="/forms/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>
      <FormsTable />
    </div>
  )
}
