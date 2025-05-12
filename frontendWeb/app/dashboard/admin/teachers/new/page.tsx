"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Teacher {
  id: number
  email: string
  password?: string
  firstname: string
  lastname: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: 0,
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  const fetchTeachers = async () => {
    setIsLoading(true)
    setError(null)
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
        email: teacher.email,
        password: teacher.password || undefined,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const teacherToSend = {
      email: newTeacher.email,
      password: newTeacher.password || undefined,
      firstname: newTeacher.firstname,
      lastname: newTeacher.lastname,
    }

    try {
      console.log(`[DEBUG] Submitting teacher:`, teacherToSend)
      const url = isEditing ? `${BACKEND_URL}/teachers/${newTeacher.id}` : `${BACKEND_URL}/teachers`
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherToSend),
      })

      console.log(`[DEBUG] Teacher submission status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to save teacher"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Teacher submission error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const savedTeacher = await response.json()
      console.log(`[DEBUG] Saved teacher:`, savedTeacher)

      const updatedTeacher = {
        id: savedTeacher.id || newTeacher.id || 0,
        email: savedTeacher.email,
        password: savedTeacher.password || undefined,
        firstname: savedTeacher.firstname,
        lastname: savedTeacher.lastname,
      }
      console.log(`[DEBUG] Normalized teacher:`, updatedTeacher)

      // Refresh teachers
      await fetchTeachers()

      // Reset form
      setNewTeacher({
        id: 0,
        email: "",
        password: "",
        firstname: "",
        lastname: "",
      })
      setIsEditing(false)

      toast({
        title: "Success",
        description: isEditing ? "Teacher updated successfully!" : "Teacher created successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error submitting teacher:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save teacher",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setNewTeacher({
      ...teacher,
      password: "", // Clear password for security
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting teacher id: ${id}`)
      const response = await fetch(`${BACKEND_URL}/teachers/${id}`, {
        method: "DELETE",
      })

      console.log(`[DEBUG] Delete teacher status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to delete teacher"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Delete teacher error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Refresh teachers
      await fetchTeachers()

      toast({
        title: "Success",
        description: "Teacher deleted successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting teacher:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete teacher",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Teachers</h1>
        <p className="text-muted-foreground">Add, edit, or delete teacher accounts in the system.</p>
      </div>

      {isLoading && <p>Loading teachers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Teacher" : "Add Teacher"}</CardTitle>
          <CardDescription>Fill in the details to {isEditing ? "update" : "create"} a teacher account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter teacher email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {isEditing && "(leave blank to keep unchanged)"}</Label>
              <Input
                id="password"
                type="password"
                placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
                value={newTeacher.password || ""}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                required={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="Enter first name"
                value={newTeacher.firstname}
                onChange={(e) => setNewTeacher({ ...newTeacher, firstname: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Enter last name"
                value={newTeacher.lastname}
                onChange={(e) => setNewTeacher({ ...newTeacher, lastname: e.target.value })}
                required
              />
            </div>
            <div className="space-x-2">
              <Button type="submit">{isEditing ? "Update Teacher" : "Add Teacher"}</Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewTeacher({
                      id: 0,
                      email: "",
                      password: "",
                      firstname: "",
                      lastname: "",
                    })
                    setIsEditing(false)
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

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
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(teacher)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the teacher "{teacher.firstname} {teacher.lastname}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(teacher.id)}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}