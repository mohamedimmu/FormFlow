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
  DialogDescription,
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
import { Loader2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/lib/data";

const userSchema = z.object({
  name: z.string().min(2, { message: "User name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, { message: "Please enter a valid mobile number (e.g., 123-456-7890)." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(['Employee', 'Admin', 'Super Admin'], {
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

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
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
    setIsLoading(true);
    try {
      await createUser({
        ...values,
        avatar: `https://picsum.photos/seed/${values.name}/100/100`, // random avatar
      });
      toast({
        title: "User Created!",
        description: `Successfully added ${values.name} to the user list.`,
      });
      onUserAdded();
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to create the user. Please try again.",
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
                        <SelectValue placeholder="Choose Admin Type" />
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
