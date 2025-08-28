
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
import { useAuth } from "@/hooks/use-auth";

const USERS_PER_PAGE = 10;

interface UsersTableProps {
  refreshKey: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ refreshKey, onEdit, onDelete }: UsersTableProps) {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { userProfile } = useAuth();

    useEffect(() => {
        async function loadUsers() {
            setIsLoading(true);
            const data = await getUsers();
            setAllUsers(data);
            setIsLoading(false);
        }
        loadUsers();
    }, [refreshKey]);

    const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const currentUsers = allUsers.slice(startIndex, endIndex);

    const getRoleClassName = (role: 'Employee' | 'Admin' | 'Super Admin') => {
        switch (role) {
            case 'Super Admin': return 'text-green-600';
            case 'Admin': return 'text-blue-600';
            case 'Employee': return 'text-red-600';
            default: return 'text-muted-foreground';
        }
    }

    const canPerformAction = (targetUser: User) => {
      if (!userProfile) return false;
      if (userProfile.role === 'Super Admin') {
        // Super Admin can't delete themselves
        return userProfile.id !== targetUser.id;
      }
      if (userProfile.role === 'Admin') {
        // Admin can only edit/delete Employees, and not themselves
        return targetUser.role === 'Employee' && userProfile.id !== targetUser.id;
      }
      return false;
    }

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }
    
    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
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
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onEdit(user)}
                        disabled={!canPerformAction(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(user)}
                        disabled={!canPerformAction(user)}
                      >
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, allUsers.length)} of {allUsers.length} Users
          </div>
          <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
