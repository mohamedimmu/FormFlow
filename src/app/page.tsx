
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("admin@formflow.com");
    const [password, setPassword] = useState("12345678");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
        } catch (error) {
            console.error("Login failed:", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white bg-gradient-to-br from-blue-600 to-blue-900 lg:flex">
        <div className="absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo className="h-8 w-8 mr-2" />
          FormFlow
        </div>
        <div className="relative z-20 mt-auto">
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
            <div className="lg:hidden text-center mb-4">
                <div className="inline-flex items-center text-lg font-medium">
                    <Logo className="h-8 w-8 mr-2 text-primary" />
                    <span className="font-semibold">FormFlow</span>
                </div>
            </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                />
            </div>
            <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
