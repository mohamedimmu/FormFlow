import { FormDisplay } from "@/components/forms/form-display";
import { forms } from "@/lib/data";
import { notFound } from "next/navigation";

export default function FormPreviewPage({ params }: { params: { id: string } }) {
    const form = forms.find(f => f.id === params.id);

    if (!form) {
        notFound();
    }

    // This is a mock. In a real app, you'd fetch the full form structure.
    const mockQuestions = [
        { id: 1, type: 'short-answer', title: 'What is your name?', required: true },
        { id: 2, type: 'paragraph', title: 'What is your feedback?', required: true },
        { id: 3, type: 'multiple-choice', title: 'What is your favorite color?', required: false, options: ['Red', 'Green', 'Blue'] },
        { id: 4, type: 'checkboxes', title: 'Which topics are you interested in?', required: false, options: ['Technology', 'Health', 'Sports'] },
        { id: 5, type: 'dropdown', title: 'Select your country', required: true, options: ['USA', 'Canada', 'Mexico'] },
        { id: 6, type: 'file-upload', title: 'Upload your profile picture', required: false },
    ];


    return (
        <div className="container mx-auto max-w-2xl py-8">
             <h1 className="text-3xl font-bold tracking-tight mb-2">{form.name}</h1>
             <p className="text-muted-foreground mb-8">{form.description}</p>
            <FormDisplay questions={mockQuestions} isPreview={true} />
        </div>
    );
}
