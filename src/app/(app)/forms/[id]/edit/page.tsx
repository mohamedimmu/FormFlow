import { FormBuilder } from "@/components/forms/form-builder";
import { forms, MOCK_QUESTIONS } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditFormPage({ params }: { params: { id: string } }) {
    const form = forms.find(f => f.id === params.id);

    if (!form) {
        notFound();
    }

    // In a real app, you would fetch the form's questions from your backend.
    // For this example, we use a consistent mock data source.
    const initialData = {
        ...form,
        questions: MOCK_QUESTIONS.slice(0, 3)
    };


    return (
        <div>
            <FormBuilder existingForm={initialData} />
        </div>
    );
}
