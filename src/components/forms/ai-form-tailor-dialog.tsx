"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { formTailor, FormTailorOutput } from "@/ai/flows/form-tailor";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  formPurpose: z.string().min(10, {
    message: "Please describe the purpose in at least 10 characters.",
  }),
  targetAudience: z.string().min(3, {
    message: "Please describe the audience in at least 3 characters.",
  }),
});

interface AiFormTailorDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  existingQuestions: string;
}

export function AiFormTailorDialog({ isOpen, setIsOpen, existingQuestions }: AiFormTailorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FormTailorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formPurpose: "",
      targetAudience: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await formTailor({
        ...values,
        existingQuestions,
      });
      setSuggestions(result);
      toast({
        title: "Suggestions Generated!",
        description: "The AI has provided recommendations for your form.",
      });
    } catch (error) {
      console.error("AI form tailor error:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to get suggestions from the AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        form.reset();
        setSuggestions(null);
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Form Tailor
          </DialogTitle>
          <DialogDescription>
            Describe your form's goal and audience to get AI-powered suggestions for improvement.
          </DialogDescription>
        </DialogHeader>

        {suggestions ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Suggested Question Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{suggestions.suggestedQuestionTypes}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Suggested Adjustments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{suggestions.suggestedAdjustments}</p>
                    </CardContent>
                </Card>
            </div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="formPurpose"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>What is the main purpose of this form?</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., To gather customer feedback on our new product" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Who is the target audience?</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., University students, marketing professionals" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormItem>
                    <FormLabel>Existing Questions</FormLabel>
                    <Textarea 
                        readOnly 
                        value={existingQuestions || "No questions added yet."}
                        className="bg-muted"
                        rows={5}
                    />
                </FormItem>
                
                <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                    ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Suggestions
                    </>
                    )}
                </Button>
                </DialogFooter>
            </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
