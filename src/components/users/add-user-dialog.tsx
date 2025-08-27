
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const countries = [
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+91", name: "India" },
    { code: "+61", name: "Australia" },
    { code: "+81", name: "Japan" },
];

const userSchema = z.object({
  name: z.string().min(2, { message: "User name must be at least 2 characters." }),
  countryCode: z.string(),
  mobile: z.string().min(5, { message: "Please enter a valid mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(['Employee', 'Admin'], {
    required_error: "You need to select a user type.",
  }),
});

interface AddUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUserAdded: () => void;
}

export function AddUserDialog({ isOpen, setIsOpen, onUserAdded }: AddUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { userProfile, createUser, sendInvitation } = useAuth();

  const canInvite = userProfile?.role?.toLowerCase() === 'super admin' || userProfile?.role?.toLowerCase() === 'admin';

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      countryCode: "+1",
      mobile: "",
      email: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  async function onSubmit(values: z.infer<typeof userSchema>) {
    if(!canInvite) {
        toast({ variant: "destructive", title: "Permission Denied", description: "You do not have permission to create new users." });
        return;
    }

    setIsLoading(true);
    try {
      const tempPassword = Math.random().toString(36).slice(-8);

      const newUser = await createUser({
        name: values.name,
        email: values.email,
        role: values.role,
        mobile: `${values.countryCode} ${values.mobile}`,
        avatar: `https://picsum.photos/seed/${values.name}/100/100`,
      }, tempPassword);

      await sendInvitation(newUser.email);
      
      toast({
        title: "User Created & Invitation Sent!",
        description: `An invitation has been sent to ${newUser.email}.`,
        duration: 10000,
      });

      onUserAdded();
      handleOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create user:", error);
      const description = error.code === 'auth/email-already-in-use'
        ? "This email is already registered. Please use a different email."
        : "Failed to create the user. Please try again.";
      
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter User Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {countries.map(country => (
                                        <SelectItem key={country.code} value={country.code}>{country.name} ({country.code})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormControl>
                                <Input placeholder="Enter Mobile Number" {...field} />
                            </FormControl>
                        )}
                    />
                </div>
                 <FormMessage>
                    {form.formState.errors.mobile?.message}
                </FormMessage>
             </FormItem>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email Id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose User Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      {userProfile?.role?.toLowerCase() === 'super admin' && (
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading || !canInvite} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Add New User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
