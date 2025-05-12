"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Teacher {
  id: number
  email: string
  firstname: string
  lastname: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeachers = async () => {
    try {
      console.log(`[DEBUG] Fetching teachers from ${BACKEND_URL}/teachers`)
      const response = await fetch(`${BACKEND_URL}/teachers`)
      console.log(`[DEBUG] Teachers fetch status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Teachers fetch error response: ${errorText}`)
        throw new Error("Failed to fetch teachers")
      }

      const data = await response.json()
      console.log(`[DEBUG] Teachers response:`, data)

      const normalizedTeachers = Array.isArray(data) ? data.map((teacher: any) => ({
        id: teacher.id || 0,
        email: teacher.email || "",
        firstname: teacher.firstname || "",
        lastname: teacher.lastname || "",
      })) : []

      setTeachers(normalizedTeachers)

      if (normalizedTeachers.length === 0) {
        console.log(`[DEBUG] No teachers found`)
        toast({
          title: "No Teachers",
          description: "No teachers found in the system.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching teachers:`, error)
      setError(error instanceof Error ? error.message : "Failed to load teachers")
      setTeachers([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load teachers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      console.log(`[DEBUG] Fetch completed, isLoading: false`)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Teachers</h1>
        <p className="text-muted-foreground">View all teacher accounts in the system.</p>
      </div>

      {isLoading && <p>Loading teachers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {teachers.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No teachers found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{teacher.firstname} {teacher.lastname}</CardTitle>
                <CardDescription>{teacher.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p><strong>ID:</strong> {teacher.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}