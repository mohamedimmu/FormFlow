
"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { updateUser, User } from "@/lib/data";

const userSchema = z.object({
  name: z.string().min(2, { message: "User name must be at least 2 characters." }),
  mobile: z.string().min(5, { message: "Please enter a valid mobile number." }),
  role: z.enum(['Employee', 'Admin', 'Super Admin'], {
    required_error: "You need to select a user type.",
  }),
});

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUserUpdated: () => void;
  user: User;
}

export function EditUserDialog({ isOpen, setIsOpen, onUserUpdated, user }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      mobile: user.mobile,
      role: user.role,
    },
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      });
    }
  }, [user, form]);


  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setIsLoading(true);
    try {
      await updateUser(user.id, {
        name: values.name,
        mobile: values.mobile,
        role: values.role,
      });
      
      toast({
        title: "User Updated",
        description: `Details for ${values.name} have been updated.`,
      });

      onUserUpdated();
      handleOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to update the user. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const canEditRole = userProfile?.role === 'Super Admin';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
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
             <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Mobile Number" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canEditRole}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose User Type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
