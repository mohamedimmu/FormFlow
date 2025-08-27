"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

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
}

export function FormDisplay({ questions }: FormDisplayProps) {
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
    switch (question.type) {
      case 'short-answer':
        return <Input id={questionId} required={question.required} />;
      case 'paragraph':
        return <Textarea id={questionId} required={question.required} />;
      case 'multiple-choice':
        return (
          <RadioGroup id={questionId} required={question.required}>
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
                <Checkbox id={`${questionId}-${index}`} />
                <Label htmlFor={`${questionId}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <Select required={question.required}>
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
        return <Input id={questionId} type="file" required={question.required} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
      {questions.map(renderQuestion)}
      <div className="flex justify-end">
        <Button type="submit">Submit Form</Button>
      </div>
    </form>
  );
}
