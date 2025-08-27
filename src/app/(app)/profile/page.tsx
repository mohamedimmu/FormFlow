
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
    const { user, userProfile } = useAuth();

    const getInitials = (name?: string) => {
        if (!name) return user?.email?.[0]?.toUpperCase() ?? 'U';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} data-ai-hint="person avatar" />
                    <AvatarFallback className="text-3xl">{getInitials(userProfile?.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">{userProfile?.name}</h2>
                    <p className="text-muted-foreground">{userProfile?.email}</p>
                    <p className="text-sm font-medium text-primary">{userProfile?.role}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={userProfile?.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userProfile?.email} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={userProfile?.role} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input id="mobile" defaultValue={userProfile?.mobile} />
                </div>
            </div>

            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
