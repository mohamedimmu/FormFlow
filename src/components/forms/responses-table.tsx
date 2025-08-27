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
import { responses } from "@/lib/data"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export function ResponsesTable() {
    // Mock question headers
    const questionHeaders = ["Satisfaction", "Feedback", "Rating (1-10)"];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Submissions</CardTitle>
                    <CardDescription>Individual responses from your audience.</CardDescription>
                </div>
                <Button variant="outline">
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
                                {questionHeaders.map(q => <TableHead key={q}>{q}</TableHead>)}
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responses.map((response) => (
                                <TableRow key={response.id}>
                                    <TableCell>{format(new Date(response.submittedAt), "PPP p")}</TableCell>
                                    <TableCell>{response.q1}</TableCell>
                                    <TableCell>{response.q2}</TableCell>
                                    <TableCell>{response.q3}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
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
