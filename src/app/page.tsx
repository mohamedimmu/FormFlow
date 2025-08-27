
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons"

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative flex h-full flex-col bg-muted p-10 text-white bg-gradient-to-br from-blue-600 to-blue-900">
        <div className="absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo className="h-8 w-8 mr-2" />
          FormFlow
        </div>
        <div className="relative z-20 mt-auto hidden lg:block">
            <h1 className="text-4xl font-bold">FormFlow</h1>
            <p className="mt-2 text-lg text-blue-200">
                Login to manage questions, share with employees, and review responses.
            </p>
        </div>
        <div className="absolute bottom-0 left-0 z-10 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full border-2 border-blue-400/30"></div>
        <div className="absolute bottom-0 left-0 z-10 h-48 w-48 translate-x-4 translate-y-4 rounded-full border-2 border-blue-400/30"></div>
      </div>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-full max-w-[350px] gap-6">
          <div className="grid gap-2 text-left">
            <h1 className="text-3xl font-bold">Login to FormFlow</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                defaultValue="javidfaaz@gmail.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/reset-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" defaultValue="12345678" required />
            </div>
             <Link href="/dashboard">
                <Button type="submit" className="w-full">
                Login
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
