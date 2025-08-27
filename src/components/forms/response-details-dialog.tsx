"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { FormResponse } from "@/lib/data"
import type { Question } from "./form-builder"
import { format } from "date-fns"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"

interface ResponseDetailsDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  response: FormResponse
  questions: Question[]
}

export function ResponseDetailsDialog({
  isOpen,
  setIsOpen,
  response,
  questions,
}: ResponseDetailsDialogProps) {
  const getQuestionTitle = (questionId: string) => {
    const question = questions.find(q => String(q.id) === questionId);
    return question ? question.title : `Question ID: ${questionId}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Submitted on {format(new Date(response.submittedAt), "PPP p")}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {Object.entries(response.answers).map(([questionId, answer]) => (
              <div key={questionId} className="grid gap-1">
                <p className="font-semibold">{getQuestionTitle(questionId)}</p>
                <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                    {Array.isArray(answer) ? answer.join(', ') : String(answer)}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
