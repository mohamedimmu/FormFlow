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
import { Eye, Link as LinkIcon, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getRecentForms, type Form } from "@/lib/data"
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function RecentForms() {
  const [recentForms, setRecentForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadRecentForms() {
        setIsLoading(true);
        const formsFromDb = await getRecentForms(5);
        setRecentForms(formsFromDb);
        setIsLoading(false);
    }
    loadRecentForms();
  }, []);

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    toast({
        title: "Link Copied!",
        description: "The responder link has been copied to your clipboard.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Forms</CardTitle>
        <CardDescription>An overview of your most recently created forms.</CardDescription>
      </CardHeader>
      <CardContent>
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
                Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
            ) : recentForms.length > 0 ? (
                recentForms.map((form) => (
                <TableRow key={form.id}>
                    <TableCell>
                    <div className="font-medium">{form.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                        {form.description}
                    </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                    <Badge variant={form.status === 'Active' ? 'default' : 'secondary'} className={form.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>
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
                        <DropdownMenuItem onClick={() => handleCopyLink(form.id)}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Copy Responder Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No recent forms found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
