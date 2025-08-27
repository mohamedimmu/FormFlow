'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { FormDisplay } from "@/components/forms/form-display";
import { getForm } from "@/lib/data";
import { Skeleton } from '@/components/ui/skeleton';
import type { Question } from '@/components/forms/form-builder';
import { Logo } from '@/components/icons';

interface FormDataType {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export default function PublicFormPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [form, setForm] = useState<FormDataType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInactive, setIsInactive] = useState(false);

    useEffect(() => {
        async function loadForm() {
            setIsLoading(true);
            const formFromDb = await getForm(id);

            if (!formFromDb) {
                setIsLoading(false);
                notFound();
                return;
            }

            if(formFromDb.status === 'Inactive') {
                setIsInactive(true);
                setIsLoading(false);
                return;
            }

            setForm({
                id: formFromDb.id,
                name: formFromDb.name,
                description: formFromDb.description,
                questions: formFromDb.questionsData || []
            });
            setIsLoading(false);
        }

        loadForm();
    }, [id]);


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
    
    if (isInactive) {
        return (
            <div className="container mx-auto max-w-2xl py-24 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Form is Inactive</h1>
                <p className="text-muted-foreground">This form is currently not accepting new responses.</p>
            </div>
        )
    }

    if (!form) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <header className="bg-background border-b py-4">
                <div className="container mx-auto max-w-2xl flex items-center gap-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-xl font-semibold">FormFlow</span>
                </div>
            </header>
            <main className="container mx-auto max-w-2xl py-8">
                <div className="bg-background p-8 rounded-lg border mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{form.name}</h1>
                    <p className="text-muted-foreground">{form.description}</p>
                </div>
                <FormDisplay questions={form.questions} formId={form.id} />
            </main>
             <footer className="py-4 text-center text-sm text-muted-foreground">
                Powered by FormFlow
            </footer>
        </div>
    );
}
