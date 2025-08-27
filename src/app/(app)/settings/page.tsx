
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        // The refreshUserProfile in the hook handles the update.
        await refreshUserProfile({ name });
        toast({
            title: "Profile Updated",
            description: "Your account information has been updated.",
        });
    } catch (error) {
        console.error("Failed to update profile", error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update your profile. Please try again.",
        })
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={userProfile?.email || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input id="mobile" value={userProfile?.mobile || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" value={userProfile?.role || ''} disabled />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpdateProfile} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>For security, you should choose a strong password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Change Password</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  )
}
