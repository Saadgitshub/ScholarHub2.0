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

interface Level {
  id: number
  name: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newLevel, setNewLevel] = useState<{ name: string }>({ name: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [editingLevelId, setEditingLevelId] = useState<number | null>(null)

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

      const normalizedLevels = Array.isArray(data) ? data.map((level: any) => ({
        id: level.id || 0,
        name: level.name || "Unknown Level",
      })) : []

      console.log(`[DEBUG] Normalized levels:`, normalizedLevels)
      setLevels(normalizedLevels)

      if (normalizedLevels.length === 0) {
        console.log(`[DEBUG] No levels found`)
        toast({
          title: "No Levels",
          description: "No levels found in the system.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching levels:`, error)
      setError(error instanceof Error ? error.message : "Failed to load levels")
      setLevels([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load levels",
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

    if (!newLevel.name) {
      toast({
        title: "Error",
        description: "Level name is required.",
        variant: "destructive",
      })
      return
    }

    const levelToSend = {
      name: newLevel.name,
    }

    try {
      console.log(`[DEBUG] Submitting level:`, levelToSend)
      console.log(`[DEBUG] Raw payload:`, JSON.stringify(levelToSend))
      const url = isEditing ? `${BACKEND_URL}/levels/${editingLevelId}` : `${BACKEND_URL}/levels`
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(levelToSend),
      })

      console.log(`[DEBUG] Level submission status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to save level"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Level submission error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const savedLevel = await response.json()
      console.log(`[DEBUG] Saved level:`, savedLevel)

      const updatedLevel = {
        id: savedLevel.id || 0,
        name: savedLevel.name || "Unknown Level",
      }
      console.log(`[DEBUG] Normalized saved level:`, updatedLevel)

      await fetchLevels()

      setNewLevel({ name: "" })
      setIsEditing(false)
      setEditingLevelId(null)

      toast({
        title: "Success",
        description: isEditing ? "Level updated successfully!" : "Level created successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error submitting level:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save level",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (level: Level) => {
    setNewLevel({ name: level.name })
    setIsEditing(true)
    setEditingLevelId(level.id)
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting level id: ${id}`)
      const response = await fetch(`${BACKEND_URL}/levels/${id}`, {
        method: "DELETE",
      })

      console.log(`[DEBUG] Delete level status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to delete level"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Delete level error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      await fetchLevels()

      toast({
        title: "Success",
        description: "Level deleted successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting level:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete level",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Levels</h1>
        <p className="text-muted-foreground">Add, edit, or delete levels in the system.</p>
      </div>

      {isLoading && <p>Loading levels...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Level" : "Add Level"}</CardTitle>
          <CardDescription>Fill in the details to {isEditing ? "update" : "create"} a level.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Level Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter level name"
                value={newLevel.name}
                onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
                required
              />
            </div>
            <div className="space-x-2">
              <Button type="submit">{isEditing ? "Update Level" : "Add Level"}</Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewLevel({ name: "" })
                    setIsEditing(false)
                    setEditingLevelId(null)
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {levels.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No levels found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <Card key={level.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{level.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p><strong>ID:</strong> {level.id}</p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(level)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the level "{level.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(level.id)}>
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