'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { getUsers, type User } from "@/lib/data"
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            setIsLoading(true);
            const data = await getUsers();
            setUsers(data);
            setIsLoading(false);
        }
        loadUsers();
    }, []);

    const getRoleClassName = (role: 'Employee' | 'Admin' | 'Super Admin') => {
        switch (role) {
            case 'Super Admin': return 'text-green-600';
            case 'Admin': return 'text-blue-600';
            case 'Employee': return 'text-red-600';
            default: return 'text-muted-foreground';
        }
    }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User Id</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email Id</TableHead>
              <TableHead>Admin Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 6}).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">#{user.id.substring(0, 5)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getRoleClassName(user.role)}`}>
                        {user.role === 'Employee' ? 'User' : user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing 1-{users.length} of {users.length} Users
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={users.length === 0}>Previous</Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">1</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">2</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">3</Button>
            <span>...</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">8</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">9</Button>
          </div>
          <Button variant="outline" size="sm" disabled={users.length === 0}>Next</Button>
        </div>
      </div>
    </>
  )
}
