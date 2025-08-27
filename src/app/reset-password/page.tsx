
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

            <div className="text-left space-y-2">
                <p className="font-semibold">Hey Jegan,</p>
                <p className="text-muted-foreground text-sm">
                Please enter your new password below. Make sure it's strong and something you'll remember. Once updated, you can use your new password to log in.
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

                <Link href="/" className="w-full">
                    <Button className="w-full h-11 text-base">
                        Reset your password
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold">Password Requirements</h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                    <li>At least 8 characters long.</li>
                    <li>Mix of letters, numbers, and symbols recommended.</li>
                    <li>Avoid using personal information.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
