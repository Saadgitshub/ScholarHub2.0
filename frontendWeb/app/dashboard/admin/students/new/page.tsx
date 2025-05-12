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

interface Student {
  id: number
  email: string
  password?: string
  firstname: string
  lastname: string
  groupId: number
  levelId: number
  groupName?: string
  levelName?: string
}

interface Group {
  id: number
  name: string
}

interface Level {
  id: number
  name: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newStudent, setNewStudent] = useState<Student>({
    id: 0,
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    groupId: 0,
    levelId: 0,
  })
  const [isEditing, setIsEditing] = useState(false)

  // Load reference data (groups, levels)
  const loadReferenceData = async () => {
    try {
      console.log(`[DEBUG] Fetching reference data from ${BACKEND_URL}`)
      const [groupsRes, levelsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/groups`),
        fetch(`${BACKEND_URL}/levels`),
      ])

      console.log(`[DEBUG] Groups fetch status: ${groupsRes.status} ${groupsRes.statusText}`)
      console.log(`[DEBUG] Levels fetch status: ${levelsRes.status} ${levelsRes.statusText}`)

      if (!groupsRes.ok) {
        const errorText = await groupsRes.text()
        console.error(`[DEBUG] Groups fetch error response: ${errorText}`)
        throw new Error("Failed to fetch groups")
      }
      if (!levelsRes.ok) {
        const errorText = await levelsRes.text()
        console.error(`[DEBUG] Levels fetch error response: ${errorText}`)
        throw new Error("Failed to fetch levels")
      }

      const [groupsData, levelsData] = await Promise.all([
        groupsRes.json(),
        levelsRes.json(),
      ])

      console.log(`[DEBUG] Groups response:`, groupsData)
      console.log(`[DEBUG] Levels response:`, levelsData)

      setGroups(Array.isArray(groupsData) ? groupsData : [])
      setLevels(Array.isArray(levelsData) ? levelsData : [])

      return { groupsData, levelsData }
    } catch (error) {
      console.error(`[DEBUG] Error loading reference data:`, error)
      setError(error instanceof Error ? error.message : "Failed to load reference data")
      return { groupsData: [], levelsData: [] }
    }
  }

  // Load and enrich students
  const fetchStudents = async (referenceData: { groupsData: Group[], levelsData: Level[] }) => {
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

      const normalizedStudents = Array.isArray(data) ? data.map((student: any) => {
        const group = referenceData.groupsData.find(g => g.id === (student.groupId || student.group?.id))
        const level = referenceData.levelsData.find(l => l.id === (student.levelId || student.level?.id))

        console.log(`[DEBUG] Enriching student id ${student.id}: groupId=${student.groupId || student.group?.id}, levelId=${student.levelId || student.level?.id}`)

        return {
          id: student.id || 0,
          email: student.email,
          password: student.password || undefined,
          firstname: student.firstname,
          lastname: student.lastname,
          groupId: student.groupId || student.group?.id || 0,
          levelId: student.levelId || student.level?.id || 0,
          groupName: group?.name || "Unknown Group",
          levelName: level?.name || "Unknown Level",
        }
      }) : []

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
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const referenceData = await loadReferenceData()
        await fetchStudents(referenceData)
      } catch (error) {
        console.error(`[DEBUG] Error in fetch sequence:`, error)
      } finally {
        setIsLoading(false)
        console.log(`[DEBUG] Fetch completed, isLoading: false`)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const studentToSend = {
      email: newStudent.email,
      password: newStudent.password || undefined,
      firstname: newStudent.firstname,
      lastname: newStudent.lastname,
      groupId: Number(newStudent.groupId),
      levelId: Number(newStudent.levelId),
    }

    try {
      console.log(`[DEBUG] Submitting student:`, studentToSend)
      const url = isEditing ? `${BACKEND_URL}/students/${newStudent.id}` : `${BACKEND_URL}/students`
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentToSend),
      })

      console.log(`[DEBUG] Student submission status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to save student"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Student submission error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const savedStudent = await response.json()
      console.log(`[DEBUG] Saved student:`, savedStudent)

      const group = groups.find(g => g.id === (savedStudent.groupId || savedStudent.group?.id || newStudent.groupId))
      const level = levels.find(l => l.id === (savedStudent.levelId || savedStudent.level?.id || newStudent.levelId))

      const updatedStudent = {
        id: savedStudent.id || newStudent.id || 0,
        email: savedStudent.email,
        password: savedStudent.password || undefined,
        firstname: savedStudent.firstname,
        lastname: savedStudent.lastname,
        groupId: savedStudent.groupId || savedStudent.group?.id || newStudent.groupId || 0,
        levelId: savedStudent.levelId || savedStudent.level?.id || newStudent.levelId || 0,
        groupName: group?.name || "Unknown Group",
        levelName: level?.name || "Unknown Level",
      }
      console.log(`[DEBUG] Normalized student:`, updatedStudent)

      // Refresh students
      const referenceData = { groupsData: groups, levelsData: levels }
      await fetchStudents(referenceData)

      // Reset form
      setNewStudent({
        id: 0,
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        groupId: 0,
        levelId: 0,
      })
      setIsEditing(false)

      toast({
        title: "Success",
        description: isEditing ? "Student updated successfully!" : "Student created successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error submitting student:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save student",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (student: Student) => {
    setNewStudent({
      ...student,
      password: "", // Clear password for security
      groupId: student.groupId,
      levelId: student.levelId,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting student id: ${id}`)
      const response = await fetch(`${BACKEND_URL}/students/${id}`, {
        method: "DELETE",
      })

      console.log(`[DEBUG] Delete student status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to delete student"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Delete student error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Refresh students
      const referenceData = { groupsData: groups, levelsData: levels }
      await fetchStudents(referenceData)

      toast({
        title: "Success",
        description: "Student deleted successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting student:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
        <p className="text-muted-foreground">Add, edit, or delete student accounts in the system.</p>
      </div>

      {isLoading && <p>Loading students...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Student" : "Add Student"}</CardTitle>
          <CardDescription>Fill in the details to {isEditing ? "update" : "create"} a student account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter student email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {isEditing && "(leave blank to keep unchanged)"}</Label>
              <Input
                id="password"
                type="password"
                placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
                value={newStudent.password || ""}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                required={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="Enter first name"
                value={newStudent.firstname}
                onChange={(e) => setNewStudent({ ...newStudent, firstname: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Enter last name"
                value={newStudent.lastname}
                onChange={(e) => setNewStudent({ ...newStudent, lastname: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupId">Group</Label>
              <select
                id="groupId"
                value={newStudent.groupId}
                onChange={(e) => setNewStudent({ ...newStudent, groupId: Number(e.target.value) })}
                required
                className="w-full border rounded-md p-2"
              >
                <option value={0} disabled>Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelId">Level</Label>
              <select
                id="levelId"
                value={newStudent.levelId}
                onChange={(e) => setNewStudent({ ...newStudent, levelId: Number(e.target.value) })}
                required
                className="w-full border rounded-md p-2"
              >
                <option value={0} disabled>Select Level</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-2">
              <Button type="submit">{isEditing ? "Update Student" : "Add Student"}</Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewStudent({
                      id: 0,
                      email: "",
                      password: "",
                      firstname: "",
                      lastname: "",
                      groupId: 0,
                      levelId: 0,
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
                <p><strong>Group:</strong> {student.groupName}</p>
                <p><strong>Level:</strong> {student.levelName}</p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(student)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the student "{student.firstname} {student.lastname}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(student.id)}>
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