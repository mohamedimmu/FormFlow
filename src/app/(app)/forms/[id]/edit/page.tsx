'use client';

import { FormBuilder } from "@/components/forms/form-builder";
import { getForm, Form } from "@/lib/data";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditFormPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [form, setForm] = useState<Form | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id || id === 'new') {
            setIsLoading(false);
            return;
        };

        async function loadForm() {
            const formFromDb = await getForm(id);
            if (!formFromDb) {
                notFound();
            }
            setForm(formFromDb);
            setIsLoading(false);
        }

        loadForm();
    }, [id]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="lg:sticky lg:top-24 space-y-4">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <FormBuilder existingForm={form!} />
        </div>
    );
}
