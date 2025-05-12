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

interface Group {
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

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newGroup, setNewGroup] = useState<{ name: string; levelId: number }>({
    name: "",
    levelId: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)

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
      setLevels(Array.isArray(data) ? data.map((level: any) => ({
        id: level.id || 0,
        name: level.name || "Unknown Level",
      })) : [])
    } catch (error) {
      console.error(`[DEBUG] Error fetching levels:`, error)
      setError(error instanceof Error ? error.message : "Failed to load levels")
      setLevels([])
    }
  }

  const fetchGroups = async () => {
    try {
      console.log(`[DEBUG] Fetching groups from ${BACKEND_URL}/groups`)
      console.log(`[DEBUG] Current levels state:`, levels)
      const response = await fetch(`${BACKEND_URL}/groups`)
      console.log(`[DEBUG] Groups fetch status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Groups fetch error response: ${errorText}`)
        throw new Error("Failed to fetch groups")
      }

      const data = await response.json()
      console.log(`[DEBUG] Groups response:`, data)

      const normalizedGroups = Array.isArray(data) ? data.map((group: any) => {
        const levelName = group.levelName || "N/A"
        const level = levels.find(l => l.name === levelName) || { id: 0, name: levelName }
        console.log(`[DEBUG] Matching level for group ${group.name}: levelName=${levelName}, foundLevel=`, level)
        return {
          id: group.id || 0,
          name: group.name || "Unknown Group",
          levelId: level.id,
          levelName: levelName,
        }
      }) : []

      console.log(`[DEBUG] Normalized groups:`, normalizedGroups)
      setGroups(normalizedGroups)

      if (normalizedGroups.length === 0) {
        console.log(`[DEBUG] No groups found`)
        toast({
          title: "No Groups",
          description: "No groups found in the system.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching groups:`, error)
      setError(error instanceof Error ? error.message : "Failed to load groups")
      setGroups([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load groups",
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
        await fetchGroups()
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
      fetchGroups()
    }
  }, [levels])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newGroup.name || newGroup.levelId === 0) {
      toast({
        title: "Error",
        description: "Group name and level are required.",
        variant: "destructive",
      })
      return
    }

    const groupToSend = {
      name: newGroup.name,
      levelId: newGroup.levelId,
    }

    try {
      console.log(`[DEBUG] Submitting group:`, groupToSend)
      console.log(`[DEBUG] Raw payload:`, JSON.stringify(groupToSend))
      const url = isEditing ? `${BACKEND_URL}/groups/${editingGroupId}` : `${BACKEND_URL}/groups`
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupToSend),
      })

      console.log(`[DEBUG] Group submission status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to save group"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Group submission error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const savedGroup = await response.json()
      console.log(`[DEBUG] Saved group:`, savedGroup)

      const levelId = savedGroup.level?.id || newGroup.levelId || 0
      const level = levels.find(l => l.id === levelId)
      console.log(`[DEBUG] Matching level for saved group: levelId=${levelId}, foundLevel=`, level)
      const updatedGroup = {
        id: savedGroup.id || 0,
        name: savedGroup.name || "Unknown Group",
        levelId: levelId,
        levelName: level?.name || savedGroup.level?.name || "N/A",
      }
      console.log(`[DEBUG] Normalized saved group:`, updatedGroup)

      await fetchGroups()

      setNewGroup({ name: "", levelId: 0 })
      setIsEditing(false)
      setEditingGroupId(null)

      toast({
        title: "Success",
        description: isEditing ? "Group updated successfully!" : "Group created successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error submitting group:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save group",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (group: Group) => {
    setNewGroup({
      name: group.name,
      levelId: group.levelId,
    })
    setIsEditing(true)
    setEditingGroupId(group.id)
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting group id: ${id}`)
      const response = await fetch(`${BACKEND_URL}/groups/${id}`, {
        method: "DELETE",
      })

      console.log(`[DEBUG] Delete group status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const responseText = await response.text()
        let errorMessage = "Failed to delete group"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Delete group error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      await fetchGroups()

      toast({
        title: "Success",
        description: "Group deleted successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting group:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete group",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Groups</h1>
        <p className="text-muted-foreground">Add, edit, or delete groups in the system.</p>
      </div>

      {isLoading && <p>Loading groups...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Group" : "Add Group"}</CardTitle>
          <CardDescription>Fill in the details to {isEditing ? "update" : "create"} a group.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelId">Level</Label>
              <select
                id="levelId"
                value={newGroup.levelId}
                onChange={(e) => setNewGroup({ ...newGroup, levelId: Number(e.target.value) })}
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
              <Button type="submit">{isEditing ? "Update Group" : "Add Group"}</Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewGroup({ name: "", levelId: 0 })
                    setIsEditing(false)
                    setEditingGroupId(null)
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {groups.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No groups found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <CardDescription>Level: {group.levelName}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p><strong>ID:</strong> {group.id}</p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(group)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the group "{group.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(group.id)}>
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