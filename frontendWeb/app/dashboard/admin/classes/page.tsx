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

interface Subject {
  id: number
  name: string
  levelId: number
  levelName: string
}

interface Level {
  id: number
  name: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState<{ name: string; levelId: number }>({
    name: "",
    levelId: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null)

  const fetchLevels = async () => {
    try {
      console.log(`[DEBUG] Fetching levels from ${BACKEND_URL}/levels`)
      const response = await fetch(`${BACKEND_URL}/levels`)
      console.log(`[DEBUG] Levels fetch status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Levels fetch error response: ${errorText}`)
        throw new Error("Failed to fetch levels")
      }

      const data = await response.json()
      console.log(`[DEBUG] Levels response:`, data)
      setLevels(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(`[DEBUG] Error fetching levels:`, error)
      setError(error instanceof Error ? error.message : "Failed to load levels")
      setLevels([])
    }
  }

  const fetchSubjects = async () => {
    try {
      console.log(`[DEBUG] Fetching subjects from ${BACKEND_URL}/subjects`)
      console.log(`[DEBUG] Current levels state:`, levels)
      const response = await fetch(`${BACKEND_URL}/subjects`)
      console.log(`[DEBUG] Subjects fetch status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Subjects fetch error response: ${errorText}`)
        throw new Error("Failed to fetch subjects")
      }

      const data = await response.json()
      console.log(`[DEBUG] Subjects response:`, data)

      const normalizedSubjects = Array.isArray(data) ? data.map((subject: any) => {
        const levelName = subject.levelName || "N/A"
        const level = levels.find(l => l.name === levelName) || { id: 0, name: levelName }
        console.log(`[DEBUG] Matching level for subject ${subject.name}: levelName=${levelName}, foundLevel=`, level)
        return {
          id: subject.id || 0,
          name: subject.name || "Unknown Subject",
          levelId: level.id,
          levelName: levelName,
        }
      }) : []

      console.log(`[DEBUG] Normalized subjects:`, normalizedSubjects)
      setSubjects(normalizedSubjects)

      if (normalizedSubjects.length === 0) {
        console.log(`[DEBUG] No subjects found`)
        toast({
          title: "No Subjects",
          description: "No subjects found in the system.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching subjects:`, error)
      setError(error instanceof Error ? error.message : "Failed to load subjects")
      setSubjects([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load subjects",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await fetchLevels()
        await fetchSubjects()
      } catch (error) {
        console.error(`[DEBUG] Error in fetch sequence:`, error)
      } finally {
        setIsLoading(false)
        console.log(`[DEBUG] Fetch completed, isLoading: false`)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (levels.length > 0) {
      fetchSubjects()
    }
  }, [levels])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newSubject.name || newSubject.levelId === 0) {
      toast({
        title: "Error",
        description: "Subject name and level are required.",
        variant: "destructive",
      })
      return
    }

    const subjectToSend = {
      name: newSubject.name,
      levelId: newSubject.levelId,
    }

    try {
      console.log(`[DEBUG] Submitting subject:`, subjectToSend)
      console.log(`[DEBUG] Raw payload:`, JSON.stringify(subjectToSend))
      const url = isEditing ? `${BACKEND_URL}/subjects/${editingSubjectId}` : `${BACKEND_URL}/subjects`
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectToSend),
      })

      console.log(`[DEBUG] Subject submission status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to save subject"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Subject submission error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const savedSubject = await response.json()
      console.log(`[DEBUG] Saved subject:`, savedSubject)

      const levelId = savedSubject.level?.id || newSubject.levelId || 0
      const level = levels.find(l => l.id === levelId)
      console.log(`[DEBUG] Matching level for saved subject: levelId=${levelId}, foundLevel=`, level)
      const updatedSubject = {
        id: savedSubject.id || 0,
        name: savedSubject.name || "Unknown Subject",
        levelId: levelId,
        levelName: level?.name || savedSubject.level?.name || "N/A",
      }
      console.log(`[DEBUG] Normalized saved subject:`, updatedSubject)

      await fetchSubjects()

      setNewSubject({ name: "", levelId: 0 })
      setIsEditing(false)
      setEditingSubjectId(null)

      toast({
        title: "Success",
        description: isEditing ? "Subject updated successfully!" : "Subject created successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error submitting subject:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save subject",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (subject: Subject) => {
    setNewSubject({
      name: subject.name,
      levelId: subject.levelId,
    })
    setIsEditing(true)
    setEditingSubjectId(subject.id)
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting subject id: ${id}`)
      const response = await fetch(`${BACKEND_URL}/subjects/${id}`, {
        method: "DELETE",
      })

      console.log(`[DEBUG] Delete subject status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to delete subject"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Delete subject error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      await fetchSubjects()

      toast({
        title: "Success",
        description: "Subject deleted successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting subject:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete subject",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Subjects</h1>
        <p className="text-muted-foreground">Add, edit, or delete subjects in the system.</p>
      </div>

      {isLoading && <p>Loading subjects...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Subject" : "Add Subject"}</CardTitle>
          <CardDescription>Fill in the details to {isEditing ? "update" : "create"} a subject.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter subject name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelId">Level</Label>
              <select
                id="levelId"
                value={newSubject.levelId}
                onChange={(e) => setNewSubject({ ...newSubject, levelId: Number(e.target.value) })}
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
              <Button type="submit">{isEditing ? "Update Subject" : "Add Subject"}</Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewSubject({ name: "", levelId: 0 })
                    setIsEditing(false)
                    setEditingSubjectId(null)
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {subjects.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No subjects found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription>Level: {subject.levelName}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p><strong>ID:</strong> {subject.id}</p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(subject)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the subject "{subject.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(subject.id)}>
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