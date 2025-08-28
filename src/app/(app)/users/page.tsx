
'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { PlusCircle, Search } from "lucide-react"
import { useState } from "react";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/lib/data";


export default function UsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { userProfile } = useAuth();

  // This function will be passed to the dialog to refresh the table
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshUsers = () => setRefreshKey(prev => prev + 1);

  const canAddUser = userProfile?.role === 'Super Admin' || userProfile?.role === 'Admin';

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">You can view and manage all your user details here.</p>
          </div>
          {canAddUser && (
            <Button onClick={() => setIsAddUserOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          )}
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
          <UsersTable 
            refreshKey={refreshKey} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      
      <AddUserDialog 
        isOpen={isAddUserOpen}
        setIsOpen={setIsAddUserOpen}
        onUserAdded={refreshUsers}
      />
      
      {selectedUser && (
        <>
          <EditUserDialog 
            isOpen={isEditUserOpen}
            setIsOpen={setIsEditUserOpen}
            onUserUpdated={refreshUsers}
            user={selectedUser}
          />
          <DeleteUserDialog
            isOpen={isDeleteUserOpen}
            setIsOpen={setIsDeleteUserOpen}
            onUserDeleted={refreshUsers}
            user={selectedUser}
          />
        </>
      )}
    </>
  )
}
