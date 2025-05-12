"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        alert("Login failed: " + errorText);
        return;
      }
  
      const userData = await response.json();
      console.log("Login success:", userData);
  
      if (userData.role === "student") {
        router.push("/dashboard/student");
      } else if (userData.role === "teacher") {
        router.push("/dashboard/teacher");
      } else if (userData.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        alert("Unknown role. Cannot navigate.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span>ScholarHub</span>
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl">Login to ScholarHub</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
           
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account? Contact your administrator
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
