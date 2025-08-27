'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Trash2,
  Plus,
  Type,
  Pilcrow,
  List,
  CheckSquare,
  ChevronDown,
  Upload,
  Sparkles,
  Eye,
  Save,
  Link as LinkIcon
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AiFormTailorDialog } from './ai-form-tailor-dialog';

type QuestionType = 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes' | 'dropdown' | 'file-upload';

interface Question {
  id: number;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[];
}

const questionTypes = [
  { type: 'short-answer', label: 'Short Answer', icon: Type },
  { type: 'paragraph', label: 'Paragraph', icon: Pilcrow },
  { type: 'multiple-choice', label: 'Multiple Choice', icon: List },
  { type: 'checkboxes', label: 'Checkboxes', icon: CheckSquare },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { type: 'file-upload', label: 'File Upload', icon: Upload },
];

const QuestionRenderer = ({ question, onRemove, onUpdate }: { question: Question; onRemove: (id: number) => void; onUpdate: (id: number, updatedQuestion: Partial<Question>) => void }) => {
  const Icon = questionTypes.find(q => q.type === question.type)?.icon || Type;

  return (
    <Card className="bg-background">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Icon className="h-5 w-5 text-muted-foreground mt-1" />
          <div className="flex-1 space-y-2">
            <Input 
              placeholder="Question Title" 
              className="text-base font-semibold border-0 shadow-none px-0 focus-visible:ring-0" 
              value={question.title}
              onChange={(e) => onUpdate(question.id, { title: e.target.value })}
            />
            {question.type === 'short-answer' && <Input placeholder="Short answer text" disabled />}
            {question.type === 'paragraph' && <Textarea placeholder="Long answer text" disabled />}
            {(question.type === 'multiple-choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
              <div className="space-y-2">
                {(question.options || ['Option 1']).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {question.type === 'multiple-choice' && <div className="h-4 w-4 rounded-full border border-muted-foreground" />}
                    {question.type === 'checkboxes' && <div className="h-4 w-4 rounded-sm border border-muted-foreground" />}
                    <Input 
                      placeholder={`Option ${index + 1}`} 
                      className="border-0 shadow-none px-0 focus-visible:ring-0"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || ['Option 1'])];
                        newOptions[index] = e.target.value;
                        onUpdate(question.id, { options: newOptions });
                      }}
                    />
                    {question.options && question.options.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                        const newOptions = question.options?.filter((_, i) => i !== index);
                        onUpdate(question.id, { options: newOptions });
                      }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="link" className="p-0 h-auto" onClick={() => {
                  const newOptions = [...(question.options || ['Option 1']), `Option ${(question.options?.length || 1) + 1}`];
                  onUpdate(question.id, { options: newOptions });
                }}>Add option</Button>
              </div>
            )}
            {question.type === 'file-upload' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border-dashed border-2 rounded-md">
                <Upload className="h-4 w-4" />
                <span>File upload input</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 p-2 border-t">
        <div className="flex items-center gap-2">
            <Switch id={`required-${question.id}`} checked={question.required} onCheckedChange={(checked) => onUpdate(question.id, { required: checked })} />
            <Label htmlFor={`required-${question.id}`}>Required</Label>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="icon" onClick={() => onRemove(question.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export function FormBuilder() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const addQuestion = (type: QuestionType) => {
    setQuestions([...questions, { id: Date.now(), type, title: '', required: false, options: ['Option 1'] }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };
  
  const updateQuestion = (id: number, updatedQuestion: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updatedQuestion } : q));
  }

  const getExistingQuestionsAsString = () => {
    return questions.map(q => `- ${q.title} (${q.type})`).join('\n');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <Input 
                    placeholder="Form Title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="text-2xl font-bold border-0 shadow-none -ml-2 w-[calc(100%+0.5rem)] focus-visible:ring-1"
                />
                <Textarea 
                    placeholder="Form Description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="border-0 shadow-none -ml-2 w-[calc(100%+0.5rem)] focus-visible:ring-1"
                />
            </CardHeader>
        </Card>
        
        {questions.map((q) => (
          <QuestionRenderer key={q.id} question={q} onRemove={removeQuestion} onUpdate={updateQuestion} />
        ))}
        
        <Card className="text-center">
            <CardContent className="p-6">
                <p className="text-muted-foreground">Add a new question to your form</p>
            </CardContent>
        </Card>

      </div>
      <div className="lg:sticky lg:top-24 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Form Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
            <Button><Save className="mr-2 h-4 w-4" /> Save & Publish</Button>
            <Button variant="secondary" className="col-span-2"><LinkIcon className="mr-2 h-4 w-4" /> Share</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Question Palette</CardTitle>
            <CardDescription>Click to add a question.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {questionTypes.map(({ type, label, icon: Icon }) => (
              <Button key={type} variant="outline" className="w-full justify-start" onClick={() => addQuestion(type)}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/40">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary"/>
                    <CardTitle className="text-primary">AI Form Tailor</CardTitle>
                </div>
                <CardDescription className="text-primary/80">
                    Get AI-powered suggestions to improve your form for your target audience.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={() => setIsAiDialogOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tailor with AI
                </Button>
            </CardContent>
        </Card>
      </div>
      <AiFormTailorDialog
        isOpen={isAiDialogOpen}
        setIsOpen={setIsAiDialogOpen}
        existingQuestions={getExistingQuestionsAsString()}
      />
    </div>
  );
}
