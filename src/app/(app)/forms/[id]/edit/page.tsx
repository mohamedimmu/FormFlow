import { FormBuilder } from "@/components/forms/form-builder";
import { forms } from "@/lib/data";
import { notFound } from "next/navigation";
import React from "react";

export default function EditFormPage({ params }: { params: { id: string } }) {
    const form = forms.find(f => f.id === params.id);

    if (!form) {
        notFound();
    }

    // In a real app, you would fetch the form's questions from your backend.
    const initialData = {
        ...form,
        questions: form.questionsData || []
    };


    return (
        <div>
            <FormBuilder existingForm={initialData} />
        </div>
    );
}
