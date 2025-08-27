
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { sendPasswordReset } = useAuth();
    const router = useRouter();


    const handleResetRequest = async () => {
        if (!email) {
            toast({ variant: "destructive", title: "Please enter your email address." });
            return;
        }
        setIsLoading(true);
        try {
            await sendPasswordReset(email);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to send reset email:", error);
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: "Could not send a password reset link. Please check the email and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-background shadow-lg overflow-hidden">
        <div className="p-8 space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 relative inline-block">
                Reset your password
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-1 w-20 bg-primary rounded-full"></div>
                </h1>
            </div>

            {isSubmitted ? (
                <div className="text-center space-y-4">
                    <p className="font-semibold text-lg">Check your inbox!</p>
                    <p className="text-muted-foreground">
                        We have sent a password reset link to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.
                    </p>
                    <Button onClick={() => router.push('/')}>Back to Login</Button>
                </div>
            ) : (
                <>
                    <div className="text-left space-y-2">
                        <p className="text-muted-foreground text-sm">
                        Enter the email address associated with your account, and we’ll send you a link to reset your password.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleResetRequest} disabled={isLoading} className="w-full h-11 text-base">
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link href="/" className="text-sm text-primary hover:underline">
                            Return to Login
                        </Link>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
}
