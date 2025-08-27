'use client';

import { useState, useEffect } from "react";
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  FileDown,
  Eye,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { getForms, type Form } from "@/lib/data"
import { Skeleton } from "../ui/skeleton";

export function FormsTable() {
  const [allForms, setAllForms] = useState<Form[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadForms() {
      setIsLoading(true);
      const formsFromDb = await getForms();
      setAllForms(formsFromDb);
      setIsLoading(false);
    }
    loadForms();
  }, []);

  const filteredForms = allForms.filter(form => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return form.status === 'Active';
    if (activeTab === 'inactive') return form.status === 'Inactive';
    return true;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <CardTitle>All Forms</CardTitle>
            <CardDescription>Manage your forms and view their performance.</CardDescription>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 ml-auto">
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={activeTab === 'active'} onCheckedChange={() => setActiveTab('active')}>Active</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={activeTab === 'inactive'} onCheckedChange={() => setActiveTab('inactive')}>Inactive</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={activeTab === 'all'} onCheckedChange={() => setActiveTab('all')}>All</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
        </Tabs>
        <div className="mt-4 border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Responses</TableHead>
                <TableHead className="hidden lg:table-cell">Created At</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredForms.map((form) => (
                  <TableRow key={form.id}>
                      <TableCell>
                      <div className="font-medium">{form.name}</div>
                      <div className="text-sm text-muted-foreground">
                          {form.questions} questions
                      </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      <Badge variant={form.status === 'Active' ? 'default' : 'secondary'} className={form.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                          {form.status}
                      </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{form.responses}</TableCell>
                      <TableCell className="hidden lg:table-cell">{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                          </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link href={`/forms/${form.id}/edit`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </Link>
                          <Link href={`/forms/${form.id}/preview`}>
                              <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                              </DropdownMenuItem>
                          </Link>
                          <Link href={`/forms/${form.id}/responses`}>
                              <DropdownMenuItem>View Responses</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                  </TableRow>
                  ))
                )}
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
