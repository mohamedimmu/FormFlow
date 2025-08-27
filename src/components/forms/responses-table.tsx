
'use client';

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
import { Button } from "@/components/ui/button"
import { FileDown, MoreHorizontal } from "lucide-react"
import { getResponses, type FormResponse } from "@/lib/data"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import type { Question } from "./form-builder";
import { ResponseDetailsDialog } from "./response-details-dialog";
import { useToast } from "@/hooks/use-toast";

interface ResponsesTableProps {
    formId: string;
    questions: Question[];
}

export function ResponsesTable({ formId, questions }: ResponsesTableProps) {
    const [responses, setResponses] = useState<FormResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        async function loadResponses() {
            setIsLoading(true);
            const data = await getResponses(formId);
            setResponses(data);
            setIsLoading(false);
        }
        loadResponses();
    }, [formId]);

    const handleViewDetails = (response: FormResponse) => {
        setSelectedResponse(response);
        setIsDetailsOpen(true);
    }

    const questionHeaders = questions.map(q => ({ id: String(q.id), title: q.title })).slice(0, 4); // Limit to first 4 questions for table view
    const hasMoreQuestions = questions.length > 4;

    const exportToCsv = () => {
        if (responses.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data to Export',
                description: 'There are no submissions to export.',
            });
            return;
        }

        const headers = ['Submitted At', ...questions.map(q => q.title)];
        const questionIds = questions.map(q => String(q.id));

        const rows = responses.map(response => {
            const rowData = [
                format(new Date(response.submittedAt), "PPP p"),
                ...questionIds.map(qid => {
                    const answer = response.answers[qid] || '';
                    const answerString = Array.isArray(answer) ? answer.join('; ') : String(answer);
                    // Escape commas and double quotes
                    return `"${answerString.replace(/"/g, '""')}"`;
                })
            ];
            return rowData.join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `form-${formId}-responses.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Submissions</CardTitle>
                        <CardDescription>Individual responses from your audience.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={exportToCsv} disabled={isLoading || responses.length === 0}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export to Excel
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Submitted At</TableHead>
                                    {questionHeaders.map(q => <TableHead key={q.id}>{q.title}</TableHead>)}
                                    {hasMoreQuestions && <TableHead>...</TableHead>}
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({length: 5}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                                            {questionHeaders.map(q => <TableCell key={q.id}><Skeleton className="h-5 w-24" /></TableCell>)}
                                            {hasMoreQuestions && <TableCell><Skeleton className="h-5 w-8" /></TableCell>}
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : responses.length > 0 ? (
                                    responses.map((response) => (
                                        <TableRow key={response.id}>
                                            <TableCell>{format(new Date(response.submittedAt), "PPP p")}</TableCell>
                                            {questionHeaders.map(q => {
                                                const answer = response.answers[q.id];
                                                const displayAnswer = Array.isArray(answer) ? answer.join(', ') : String(answer || '-');
                                                return <TableCell key={q.id} className="truncate max-w-xs">{displayAnswer}</TableCell>
                                            })}
                                            {hasMoreQuestions && <TableCell>...</TableCell>}
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => handleViewDetails(response)}>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={questionHeaders.length + (hasMoreQuestions ? 2 : 1)} className="h-24 text-center">
                                            No submissions yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button variant="outline" size="sm" disabled={responses.length === 0}>Previous</Button>
                        <Button variant="outline" size="sm" disabled={responses.length === 0}>Next</Button>
                    </div>
                </CardContent>
            </Card>
            {selectedResponse && (
                <ResponseDetailsDialog 
                    isOpen={isDetailsOpen}
                    setIsOpen={setIsDetailsOpen}
                    response={selectedResponse}
                    questions={questions}
                />
            )}
        </>
    )
}
