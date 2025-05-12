"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Student {
  id: number
  email: string
  firstname: string
  lastname: string
  group: {
    id: number
    name: string
  } | null
  level: {
    id: number
    name: string
  } | null
}

const BACKEND_URL = "http://localhost:8080/api"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log(`[DEBUG] Fetching students from ${BACKEND_URL}/students`)
        const response = await fetch(`${BACKEND_URL}/students`)
        console.log(`[DEBUG] Students fetch status: ${response.status} ${response.statusText}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[DEBUG] Students fetch error response: ${errorText}`)
          throw new Error("Failed to fetch students")
        }

        const data = await response.json()
        console.log(`[DEBUG] Students response:`, data)

        const normalizedStudents = Array.isArray(data) ? data.map((student: any) => ({
          id: student.id,
          email: student.email,
          firstname: student.firstname,
          lastname: student.lastname,
          group: student.group || student.groupId ? { id: student.group?.id || student.groupId, name: student.group?.name || "Unknown Group" } : null,
          level: student.level || student.levelId ? { id: student.level?.id || student.levelId, name: student.level?.name || "Unknown Level" } : null,
        })) : []

        setStudents(normalizedStudents)

        if (normalizedStudents.length === 0) {
          console.log(`[DEBUG] No students found`)
          toast({
            title: "No Students",
            description: "No students found in the system.",
            variant: "default",
          })
        }
      } catch (error) {
        console.error(`[DEBUG] Error fetching students:`, error)
        setError(error instanceof Error ? error.message : "Failed to load students")
        setStudents([])
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load students",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        console.log(`[DEBUG] Fetch completed, isLoading: false`)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Students</h1>
        <p className="text-muted-foreground">View all students enrolled in the system.</p>
      </div>

      {isLoading && <p>Loading students...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {students.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No students found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{student.firstname} {student.lastname}</CardTitle>
                <CardDescription>{student.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p><strong>ID:</strong> {student.id}</p>
                <p><strong>Group:</strong> {student.group?.name ?? "N/A"}</p>
                <p><strong>Level:</strong> {student.level?.name ?? "N/A"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}