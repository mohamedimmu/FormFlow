'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { getForm, type Form } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShareDialog } from '@/components/forms/share-dialog';

export default function ShareFormPage() {
    const params = useParams();
    const id = params.id as string;
    const [form, setForm] = useState<Form | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formUrl, setFormUrl] = useState('');
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFormUrl(`${window.location.origin}/form/${id}`);
        }

        async function loadForm() {
            if (!id) return;
            setIsLoading(true);
            const formFromDb = await getForm(id);
            if (!formFromDb) {
                notFound();
            }
            setForm(formFromDb);
            setIsLoading(false);
        }

        loadForm();
    }, [id]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(formUrl);
        toast({
            title: "Link Copied!",
            description: "The form link has been copied to your clipboard.",
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-64" />
                </div>
                <Skeleton className="h-48" />
            </div>
        );
    }
    
    if (!form) {
        return notFound();
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(formUrl)}`;

    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">QR Code & Sharing</h1>
                    <p className="text-muted-foreground">Share your form with employees</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="items-center text-center">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <QrCode className="h-5 w-5" />
                                    QR Code
                                </div>
                                <p className="text-sm text-muted-foreground">Scan this to access the form</p>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <div className="p-4 border rounded-md">
                                    <Image 
                                        src={qrCodeUrl} 
                                        alt="Form QR Code" 
                                        width={250} 
                                        height={250} 
                                        priority
                                        unoptimized // Necessary for external QR code generator
                                    />
                                </div>
                                <p className="font-medium text-center">{form.name}</p>
                                 <Button className="w-full" onClick={() => setIsShareDialogOpen(true)}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share QR Code
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Link</CardTitle>
                                <CardDescription>Share this link with employees to access the form</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div>
                                    <Label htmlFor="form-url">Form URL</Label>
                                    <div className="flex gap-2">
                                        <Input id="form-url" readOnly value={formUrl} />
                                        <Button variant="outline" size="icon" onClick={handleCopyLink}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Button className="w-full" onClick={() => setIsShareDialogOpen(true)}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share Form
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Form Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Title: <span className="font-normal">{form.name}</span></h3>
                                    <h3 className="font-semibold">Description: <span className="font-normal">{form.description}</span></h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>How to Share</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Using QR Code</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>Click Share button & Share via any app (eg: Whatsapp etc.,)</li>
                                <li>Employees can scan with their phone camera</li>
                                <li>Works with any QR code scanner app</li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold text-lg mb-2">Using Direct Link</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                 <li>Copy the form URL</li>
                                 <li>Send via email, WhatsApp, or messaging apps</li>
                                 <li>Works with any device</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <ShareDialog 
                isOpen={isShareDialogOpen}
                setIsOpen={setIsShareDialogOpen}
                formName={form.name}
                formUrl={formUrl}
            />
        </>
    );
}
