
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function SetPasswordPage({ params }: { params: { token: string } }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { completePasswordReset } = useAuth();
    
    // In a real Firebase app, the 'token' from the URL isn't used directly here.
    // Instead, the oobCode from the email link is what matters.
    // This page is the landing spot for that link.

    const handleSetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({ variant: "destructive", title: "Passwords do not match."});
            return;
        }
        if (newPassword.length < 6) {
            toast({ variant: "destructive", title: "Password must be at least 6 characters."});
            return;
        }

        setIsLoading(true);
        try {
            // The oobCode is a URL param added by Firebase, we need to extract it
            const urlParams = new URLSearchParams(window.location.search);
            const oobCode = urlParams.get('oobCode');

            if (!oobCode) {
                throw new Error("Invalid or missing action code. Please use the link from your email.");
            }
            
            await completePasswordReset(oobCode, newPassword);

            toast({
                title: "Password Set Successfully!",
                description: "You can now log in with your new password.",
            });
            router.push('/');
        } catch (error) {
            console.error("Failed to set password:", error);
            toast({
                variant: "destructive",
                title: "Failed to Set Password",
                description: "The link may be invalid or expired. Please request a new one.",
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
                Create Your Password
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-1 w-20 bg-primary rounded-full"></div>
                </h1>
            </div>

            <div className="text-left space-y-2">
                <p className="font-semibold">Welcome!</p>
                <p className="text-muted-foreground text-sm">
                  You've been invited to join. Please set a password for your account to get started. Make sure it's strong and something you'll remember.
                </p>
            </div>

            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Input 
                            id="new-password" 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                        <Input 
                            id="confirm-password" 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <Button onClick={handleSetPassword} disabled={isLoading} className="w-full h-11 text-base">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Set Password & Login
                </Button>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold">Password Requirements</h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                    <li>At least 6 characters long.</li>
                    <li>Mix of letters, numbers, and symbols recommended.</li>
                    <li>Avoid using personal information.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
