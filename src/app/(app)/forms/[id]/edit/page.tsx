import { FormBuilder } from "@/components/forms/form-builder";
import { forms } from "@/lib/data";
import { notFound } from "next/navigation";

// This is a mock. In a real app, you'd fetch the full form structure.
const mockQuestions = [
    { id: 1, type: 'short-answer', title: 'What is your name?', required: true, options: [] },
    { id: 2, type: 'paragraph', title: 'What is your feedback?', required: true, options: [] },
    { id: 3, type: 'multiple-choice', title: 'What is your favorite color?', required: false, options: ['Red', 'Green', 'Blue'] },
];


export default function EditFormPage({ params }: { params: { id: string } }) {
    const form = forms.find(f => f.id === params.id);

    if (!form) {
        notFound();
    }

    // In a real app, you would fetch the form's questions from your backend.
    // For this example, we'll use a subset of the preview questions.
    const initialData = {
        ...form,
        questions: mockQuestions.slice(0, form.questions > 3 ? 3 : form.questions)
    };


    return (
        <div>
            <FormBuilder existingForm={initialData} />
        </div>
    );
}
