"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createResponse } from "@/lib/data"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type QuestionType = 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes' | 'dropdown' | 'file-upload';

interface Question {
  id: number;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[];
}

interface FormDisplayProps {
  questions: Question[];
  formId: string;
  isPreview?: boolean;
}

export function FormDisplay({ questions, formId, isPreview = false }: FormDisplayProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(isPreview) return;

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const answers: { [key: string]: any } = {};

    formData.forEach((value, key) => {
        // For checkboxes, we might have multiple values for the same key
        if (answers[key]) {
            if (Array.isArray(answers[key])) {
                answers[key].push(value);
            } else {
                answers[key] = [answers[key], value];
            }
        } else {
            answers[key] = value;
        }
    });

    try {
        await createResponse(formId, answers);
        setIsSubmitted(true);
    } catch (error) {
        console.error("Failed to submit response: ", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error submitting your form. Please try again."
        })
    } finally {
        setIsLoading(false);
    }
  }

  const renderQuestion = (question: Question) => {
    const questionId = `q-${question.id}`;
    return (
      <Card key={question.id} className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor={questionId} className="text-lg font-semibold flex items-center">
              {question.title}
              {question.required && <span className="text-destructive ml-2">*</span>}
            </Label>
            {renderInput(question, questionId)}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderInput = (question: Question, questionId: string) => {
    // The `name` prop is crucial for FormData to pick up the value
    const name = String(question.id);

    switch (question.type) {
      case 'short-answer':
        return <Input id={questionId} name={name} required={question.required} disabled={isPreview || isLoading} />;
      case 'paragraph':
        return <Textarea id={questionId} name={name} required={question.required} disabled={isPreview || isLoading} />;
      case 'multiple-choice':
        return (
          <RadioGroup id={questionId} name={name} required={question.required} disabled={isPreview || isLoading}>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${questionId}-${index}`} />
                <Label htmlFor={`${questionId}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkboxes':
        return (
          <div id={questionId} className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${questionId}-${index}`} name={name} value={option} disabled={isPreview || isLoading} />
                <Label htmlFor={`${questionId}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <Select name={name} required={question.required} disabled={isPreview || isLoading}>
            <SelectTrigger id={questionId}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'file-upload':
        // Note: file uploads via this method will require more complex server-side handling, not covered here.
        return <Input id={questionId} name={name} type="file" required={question.required} disabled={isPreview || isLoading} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
        <Card className="py-24">
            <CardContent className="text-center space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Thank You!</h2>
                <p className="text-muted-foreground">Your response has been submitted successfully.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(renderQuestion)}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPreview || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Form
        </Button>
      </div>
    </form>
  );
}
