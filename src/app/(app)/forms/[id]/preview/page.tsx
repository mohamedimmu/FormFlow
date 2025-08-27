'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { FormDisplay } from "@/components/forms/form-display";
import { forms, MOCK_QUESTIONS } from "@/lib/data";
import { Skeleton } from '@/components/ui/skeleton';
import type { Question } from '@/components/forms/form-builder';

// Create a unified type for our form data
interface FormDataType {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export default function FormPreviewPage({ params }: { params: { id: string } }) {
    const [previewForm, setPreviewForm] = useState<FormDataType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect runs only on the client-side
        try {
            const storedPreviewData = localStorage.getItem('form-preview');
            if (storedPreviewData) {
                const parsedData: FormDataType = JSON.parse(storedPreviewData);
                // Use this data if it's for the form being previewed (or a new unsaved form)
                if (parsedData.id === params.id || params.id === 'new') {
                    setPreviewForm(parsedData);
                    // We clear it so a normal page load doesn't accidentally pick it up again
                    localStorage.removeItem('form-preview');
                    setIsLoading(false);
                    return;
                }
            }
        } catch (error) {
            console.error("Could not parse form preview data from localStorage", error);
            // Clear potentially corrupted data
            localStorage.removeItem('form-preview');
        }
        
        // Fallback to mock data if nothing valid in local storage
        const form = forms.find(f => f.id === params.id);
        if (form) {
            // Use the consistent mock data source
            setPreviewForm({
                ...form,
                questions: MOCK_QUESTIONS.slice(0, form.questions)
            });
        }
        setIsLoading(false);

    }, [params.id]);


    if (isLoading) {
        return (
            <div className="container mx-auto max-w-2xl py-8 space-y-8">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        )
    }
    
    if (!previewForm) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-2xl py-8">
             <h1 className="text-3xl font-bold tracking-tight mb-2">{previewForm.name}</h1>
             <p className="text-muted-foreground mb-8">{previewForm.description}</p>
            <FormDisplay questions={previewForm.questions} isPreview={true} />
        </div>
    );
}
