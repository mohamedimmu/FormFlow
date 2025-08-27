'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { PlusCircle, Search } from "lucide-react"
import { useState } from "react";
import { AddUserDialog } from "@/components/users/add-user-dialog";

export default function UsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // This function will be passed to the dialog to refresh the table
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshUsers = () => setRefreshKey(prev => prev + 1);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">You can view and manage all your user details here.</p>
          </div>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search here"
              className="w-full appearance-none bg-background pl-8 md:w-1/3"
            />
          </div>
          <UsersTable refreshKey={refreshKey} />
        </div>
      </div>
      <AddUserDialog 
        isOpen={isAddUserOpen}
        setIsOpen={setIsAddUserOpen}
        onUserAdded={refreshUsers}
      />
    </>
  )
}
