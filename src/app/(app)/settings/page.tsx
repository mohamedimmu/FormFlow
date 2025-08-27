
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
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
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your Name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" disabled />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Update Profile</Button>
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
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select>
                            <SelectTrigger id="language">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select>
                            <SelectTrigger id="theme">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="marketing-emails" />
                        <Label htmlFor="marketing-emails" className="font-normal">
                            Receive marketing emails and updates.
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
