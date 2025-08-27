import type { Question } from "@/components/forms/form-builder";

export type Form = {
  id: string;
  name: string;
  description: string;
  questions: number;
  responses: number;
  createdAt: string;
  status: 'Active' | 'Inactive';
  questionsData?: Question[];
};

export const forms: Form[] = [
  {
    id: '1',
    name: 'Customer Satisfaction Survey',
    description: 'Gather feedback from our recent customers.',
    questions: 5,
    responses: 128,
    createdAt: '2023-10-26',
    status: 'Active',
    questionsData: [
        { id: 1, type: 'multiple-choice', title: 'How satisfied are you with your recent purchase?', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'] },
        { id: 2, type: 'short-answer', title: 'Which product did you purchase?', required: true },
        { id: 3, type: 'paragraph', title: 'Do you have any suggestions for improvement?', required: false },
        { id: 4, type: 'dropdown', title: 'How did you hear about us?', required: false, options: ['Social Media', 'Friend or Family', 'Advertisement', 'Search Engine'] },
        { id: 5, type: 'checkboxes', title: 'Which features do you use the most?', required: false, options: ['Feature A', 'Feature B', 'Feature C'] },
    ]
  },
  {
    id: '2',
    name: 'Employee Engagement Poll',
    description: 'Monthly check-in with the team.',
    questions: 4,
    responses: 45,
    createdAt: '2023-10-20',
    status: 'Active',
    questionsData: [
        { id: 1, type: 'short-answer', title: 'What is your name? (Optional)', required: false },
        { id: 2, type: 'paragraph', title: 'What went well this month?', required: true },
        { id: 3, type: 'paragraph', title: 'What could be improved?', required: true },
        { id: 4, type: 'dropdown', title: 'Overall, how are you feeling?', required: true, options: ['Great', 'Good', 'Okay', 'Not great'] },
    ]
  },
  {
    id: '3',
    name: 'Q3 Product Feedback',
    description: 'Feedback on the new feature releases in Q3.',
    questions: 3,
    responses: 302,
    createdAt: '2023-09-15',
    status: 'Inactive',
    questionsData: [
        { id: 1, type: 'multiple-choice', title: 'Have you used the new "Analytics Dashboard" feature?', required: true, options: ['Yes', 'No'] },
        { id: 2, type: 'paragraph', title: 'If yes, what are your thoughts on the new Analytics Dashboard?', required: false },
        { id: 3, type: 'short-answer', title: 'What is one feature you would like to see added?', required: false },
    ]
  },
  {
    id: '4',
    name: 'Website Usability Test',
    description: 'How easy is it to use our new website?',
    questions: 2,
    responses: 76,
    createdAt: '2023-09-01',
    status: 'Active',
    questionsData: [
        { id: 1, type: 'short-answer', title: 'Were you able to find what you were looking for?', required: true },
        { id: 2, type: 'paragraph', title: 'Please describe your overall experience.', required: true },
    ]
  },
  {
    id: '5',
    name: 'New Hire Onboarding Feedback',
    description: 'Feedback from new hires on the onboarding process.',
    questions: 3,
    responses: 12,
    createdAt: '2023-08-22',
    status: 'Inactive',
    questionsData: [
        { id: 1, type: 'dropdown', title: 'How would you rate the onboarding process?', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        { id: 2, type: 'paragraph', title: 'What was the most helpful part of onboarding?', required: false },
        { id: 3, type: 'paragraph', title: 'What could be improved in the onboarding process?', required: false },
    ]
  },
];

export type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'Employee' | 'Admin' | 'Super Admin';
  avatar: string;
};

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    mobile: '123-456-7890',
    role: 'Admin',
    avatar: '/avatars/01.png',
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    mobile: '234-567-8901',
    role: 'Employee',
    avatar: '/avatars/02.png',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    mobile: '345-678-9012',
    role: 'Employee',
    avatar: '/avatars/03.png',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    mobile: '456-789-0123',
    role: 'Super Admin',
    avatar: '/avatars/04.png',
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan.h@example.com',
    mobile: '567-890-1234',
    role: 'Admin',
    avatar: '/avatars/05.png',
  },
];

export type FormResponse = {
    id: string;
    submittedAt: string;
    [key: string]: any;
}

export const responses: FormResponse[] = [
    { id: 'resp1', submittedAt: '2023-10-27T10:00:00Z', q1: 'Very Satisfied', q2: 'User-friendly interface', q3: '10' },
    { id: 'resp2', submittedAt: '2023-10-27T10:05:00Z', q1: 'Satisfied', q2: 'Could be faster', q3: '8' },
    { id: 'resp3', submittedAt: '2023-10-27T10:10:00Z', q1: 'Neutral', q2: 'It\'s okay', q3: '7' },
    { id: 'resp4', submittedAt: '2023-10-27T11:20:00Z', q1: 'Very Satisfied', q2: 'Excellent customer support!', q3: '9' },
];

export const MOCK_QUESTIONS: Question[] = [
    { id: 1, type: 'short-answer', title: 'What is your name?', required: true, options: [] },
    { id: 2, type: 'paragraph', title: 'What is your feedback?', required: true, options: [] },
    { id: 3, type: 'multiple-choice', title: 'What is your favorite color?', required: false, options: ['Red', 'Green', 'Blue'] },
    { id: 4, type: 'checkboxes', title: 'Which topics are you interested in?', required: false, options: ['Technology', 'Health', 'Sports'] },
    { id: 5, type: 'dropdown', title: 'Select your country', required: true, options: ['USA', 'Canada', 'Mexico'] },
    { id: 6, type: 'file-upload', title: 'Upload your profile picture', required: false, options: [] },
];
