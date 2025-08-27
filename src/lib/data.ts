export type Form = {
  id: string;
  name: string;
  description: string;
  questions: number;
  responses: number;
  createdAt: string;
  status: 'Active' | 'Inactive';
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
  },
  {
    id: '2',
    name: 'Employee Engagement Poll',
    description: 'Monthly check-in with the team.',
    questions: 8,
    responses: 45,
    createdAt: '2023-10-20',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Q3 Product Feedback',
    description: 'Feedback on the new feature releases in Q3.',
    questions: 12,
    responses: 302,
    createdAt: '2023-09-15',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Website Usability Test',
    description: 'How easy is it to use our new website?',
    questions: 7,
    responses: 76,
    createdAt: '2023-09-01',
    status: 'Active',
  },
  {
    id: '5',
    name: 'New Hire Onboarding Feedback',
    description: 'Feedback from new hires on the onboarding process.',
    questions: 10,
    responses: 12,
    createdAt: '2023-08-22',
    status: 'Inactive',
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
