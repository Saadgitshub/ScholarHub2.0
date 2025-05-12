"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash, School } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface Program {
  id: number
  teacher: { id: number; firstname: string; lastname: string }
  group: { id: number; name: string; level: { id: number; name: string } }
  subject: { id: number; name: string; levelName: string }
}

interface Teacher {
  id: number
  firstname: string
  lastname: string
}

interface Group {
  id: number
  name: string
  level: { id: number; name: string }
}

interface Subject {
  id: number
  name: string
  levelName: string
}

const programSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  groupId: z.string().min(1, "Group is required"),
  subjectId: z.string().min(1, "Subject is required"),
})

type ProgramFormData = z.infer<typeof programSchema>

const BACKEND_URL = "http://localhost:8080/api"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      teacherId: "",
      groupId: "",
      subjectId: "",
    },
  })

  const fetchPrograms = async () => {
    try {
      console.log(`[DEBUG] Fetching programs from ${BACKEND_URL}/programs`)
      const response = await fetch(`${BACKEND_URL}/programs`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Programs fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Programs fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch programs: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Programs response:`, data)
      const normalizedPrograms = Array.isArray(data)
        ? data.map((program: any) => ({
            id: program.id || 0,
            teacher: {
              id: program.teacher?.id || 0,
              firstname: program.teacher?.firstname || "Unknown",
              lastname: program.teacher?.lastname || "Teacher",
            },
            group: {
              id: program.group?.id || 0,
              name: program.group?.name || "Unknown Group",
              level: {
                id: program.group?.level?.id || 0,
                name: program.group?.level?.name || "N/A",
              },
            },
            subject: {
              id: program.subject?.id || 0,
              name: program.subject?.name || "Unknown Subject",
              levelName: program.subject?.levelName || "N/A",
            },
          }))
        : []
      setPrograms(normalizedPrograms)
      if (normalizedPrograms.length === 0) {
        console.log(`[DEBUG] No programs found`)
        toast({ title: "No Programs", description: "No programs found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching programs:`, error)
      setError(error instanceof Error ? error.message : "Failed to load programs")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load programs",
        variant: "destructive",
      })
    }
  }

  const fetchTeachers = async () => {
    try {
      console.log(`[DEBUG] Fetching teachers from ${BACKEND_URL}/teachers`)
      const response = await fetch(`${BACKEND_URL}/teachers`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Teachers fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Teachers fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch teachers: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Teachers response:`, data)
      const normalizedTeachers = Array.isArray(data)
        ? data.map((teacher: any) => ({
            id: teacher.id || 0,
            firstname: teacher.firstname || "Unknown",
            lastname: teacher.lastname || "Teacher",
          }))
        : []
      setTeachers(normalizedTeachers)
      if (normalizedTeachers.length === 0) {
        console.log(`[DEBUG] No teachers found`)
        toast({ title: "No Teachers", description: "No teachers found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching teachers:`, error)
      setError(error instanceof Error ? error.message : "Failed to load teachers")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load teachers",
        variant: "destructive",
      })
    }
  }

  const fetchGroups = async () => {
    try {
      console.log(`[DEBUG] Fetching groups from ${BACKEND_URL}/groups`)
      const response = await fetch(`${BACKEND_URL}/groups`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Groups fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Groups fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch groups: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Groups response:`, data)
      const normalizedGroups = Array.isArray(data)
        ? data.map((group: any) => ({
            id: group.id || 0,
            name: group.name || "Unknown Group",
            level: {
              id: group.level?.id || 0,
              name: group.level?.name || "N/A",
            },
          }))
        : []
      setGroups(normalizedGroups)
      if (normalizedGroups.length === 0) {
        console.log(`[DEBUG] No groups found`)
        toast({ title: "No Groups", description: "No groups found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching groups:`, error)
      setError(error instanceof Error ? error.message : "Failed to load groups")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load groups",
        variant: "destructive",
      })
    }
  }

  const fetchSubjects = async () => {
    try {
      console.log(`[DEBUG] Fetching subjects from ${BACKEND_URL}/subjects`)
      const response = await fetch(`${BACKEND_URL}/subjects`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Subjects fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Subjects fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch subjects: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Subjects response:`, data)
      const normalizedSubjects = Array.isArray(data)
        ? data.map((subject: any) => ({
            id: subject.id || 0,
            name: subject.name || "Unknown Subject",
            levelName: subject.levelName || "N/A",
          }))
        : []
      setSubjects(normalizedSubjects)
      if (normalizedSubjects.length === 0) {
        console.log(`[DEBUG] No subjects found`)
        toast({ title: "No Subjects", description: "No subjects found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching subjects:`, error)
      setError(error instanceof Error ? error.message : "Failed to load subjects")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load subjects",
        variant: "destructive",
      })
    }
  }

  const handleAddProgram = async (data: ProgramFormData) => {
    try {
      console.log(`[DEBUG] Creating program with form data:`, data)
      const teacherId = parseInt(data.teacherId)
      const groupId = parseInt(data.groupId)
      const subjectId = parseInt(data.subjectId)

      // Validate IDs
      if (isNaN(teacherId) || !teachers.find((t) => t.id === teacherId)) {
        throw new Error("Invalid teacher selected")
      }
      if (isNaN(groupId) || !groups.find((g) => g.id === groupId)) {
        throw new Error("Invalid group selected")
      }
      if (isNaN(subjectId) || !subjects.find((s) => s.id === subjectId)) {
        throw new Error("Invalid subject selected")
      }

      // Construct Program entity
      const program = {
        teacher: teachers.find((t) => t.id === teacherId),
        group: groups.find((g) => g.id === groupId),
        subject: subjects.find((s) => s.id === subjectId),
      }

      console.log(`[DEBUG] Sending program to backend:`, program)

      const response = await fetch(`${BACKEND_URL}/programs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(program),
      })
      console.log(`[DEBUG] Create program status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Create program error response: ${errorText}`)
        throw new Error(`Failed to create program: ${errorText}`)
      }
      const newProgram = await response.json()
      console.log(`[DEBUG] Created program:`, newProgram)
      setPrograms([...programs, {
        id: newProgram.id,
        teacher: {
          id: newProgram.teacher.id,
          firstname: newProgram.teacher.firstname || "Unknown",
          lastname: newProgram.teacher.lastname || "Teacher",
        },
        group: {
          id: newProgram.group.id,
          name: newProgram.group.name || "Unknown Group",
          level: {
            id: newProgram.group.level?.id || 0,
            name: newProgram.group.level?.name || "N/A",
          },
        },
        subject: {
          id: newProgram.subject.id,
          name: newProgram.subject.name || "Unknown Subject",
          levelName: newProgram.subject.levelName || "N/A",
        },
      }])
      setIsAddDialogOpen(false)
      form.reset()
      toast({
        title: "Success",
        description: "Program created successfully.",
      })
    } catch (error) {
      console.error(`[DEBUG] Error creating program:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create program",
        variant: "destructive",
      })
    }
  }

  const handleEditProgram = async (data: ProgramFormData) => {
    if (!selectedProgram) return
    try {
      console.log(`[DEBUG] Updating program ${selectedProgram.id} with form data:`, data)
      const teacherId = parseInt(data.teacherId)
      const groupId = parseInt(data.groupId)
      const subjectId = parseInt(data.subjectId)

      // Validate IDs
      if (isNaN(teacherId) || !teachers.find((t) => t.id === teacherId)) {
        throw new Error("Invalid teacher selected")
      }
      if (isNaN(groupId) || !groups.find((g) => g.id === groupId)) {
        throw new Error("Invalid group selected")
      }
      if (isNaN(subjectId) || !subjects.find((s) => s.id === subjectId)) {
        throw new Error("Invalid subject selected")
      }

      // Construct Program entity
      const program = {
        id: selectedProgram.id,
        teacher: teachers.find((t) => t.id === teacherId),
        group: groups.find((g) => g.id === groupId),
        subject: subjects.find((s) => s.id === subjectId),
      }

      console.log(`[DEBUG] Sending updated program to backend:`, program)

      const response = await fetch(`${BACKEND_URL}/programs/${selectedProgram.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(program),
      })
      console.log(`[DEBUG] Update program status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Update program error response: ${errorText}`)
        throw new Error(`Failed to update program: ${errorText}`)
      }
      const updatedProgram = await response.json()
      console.log(`[DEBUG] Updated program:`, updatedProgram)
      setPrograms(
        programs.map((program) =>
          program.id === selectedProgram.id
            ? {
                id: updatedProgram.id,
                teacher: {
                  id: updatedProgram.teacher.id,
                  firstname: updatedProgram.teacher.firstname || "Unknown",
                  lastname: updatedProgram.teacher.lastname || "Teacher",
                },
                group: {
                  id: updatedProgram.group.id,
                  name: updatedProgram.group.name || "Unknown Group",
                  level: {
                    id: updatedProgram.group.level?.id || 0,
                    name: updatedProgram.group.level?.name || "N/A",
                  },
                },
                subject: {
                  id: updatedProgram.subject.id,
                  name: updatedProgram.subject.name || "Unknown Subject",
                  levelName: updatedProgram.subject.levelName || "N/A",
                },
              }
            : program
        )
      )
      setIsEditDialogOpen(false)
      setSelectedProgram(null)
      form.reset()
      toast({
        title: "Success",
        description: "Program updated successfully.",
      })
    } catch (error) {
      console.error(`[DEBUG] Error updating program:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update program",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProgram = async () => {
    if (!selectedProgram) return
    try {
      console.log(`[DEBUG] Deleting program ${selectedProgram.id}`)
      const response = await fetch(`${BACKEND_URL}/programs/${selectedProgram.id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Delete program status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Delete program error response: ${errorText}`)
        throw new Error(`Failed to delete program: ${errorText}`)
      }
      setPrograms(programs.filter((program) => program.id !== selectedProgram.id))
      setIsDeleteDialogOpen(false)
      setSelectedProgram(null)
      toast({
        title: "Success",
        description: "Program deleted successfully.",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting program:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete program",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all([
          fetchPrograms(),
          fetchTeachers(),
          fetchGroups(),
          fetchSubjects(),
        ])
      } catch (error) {
        console.error(`[DEBUG] Error in fetch sequence:`, error)
        setError("Failed to load programs data")
      } finally {
        setIsLoading(false)
        console.log(`[DEBUG] Fetch completed, isLoading: false`)
      }
    }
    fetchData()
  }, [])

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program)
    form.reset({
      teacherId: program.teacher.id.toString(),
      groupId: program.group.id.toString(),
      subjectId: program.subject.id.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (program: Program) => {
    setSelectedProgram(program)
    setIsDeleteDialogOpen(true)
  }

  const canAddProgram = teachers.length > 0 && groups.length > 0 && subjects.length > 0

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Programs</h1>
          <p className="text-muted-foreground">
            Add, edit, or delete programs for your school.
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!canAddProgram}
          title={
            !canAddProgram
              ? "No teachers, groups, or subjects available to create a program"
              : undefined
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>
      {isLoading && <p>Loading programs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Card>
        <CardHeader>
          <CardTitle>Programs</CardTitle>
          <CardDescription>All programs in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No programs found.
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.id}</TableCell>
                    <TableCell>{program.subject.name}</TableCell>
                    <TableCell>{`${program.teacher.firstname} ${program.teacher.lastname}`}</TableCell>
                    <TableCell>{program.group.name}</TableCell>
                    <TableCell>{program.group.level.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(program)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(program)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Program Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Program</DialogTitle>
            <DialogDescription>
              Create a new program by selecting a teacher, group, and subject.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddProgram)} className="space-y-4">
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {`${teacher.firstname} ${teacher.lastname}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Program</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>
              Update the teacher, group, or subject for this program.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditProgram)} className="space-y-4">
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {`${teacher.firstname} ${teacher.lastname}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setSelectedProgram(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Program Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this program? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedProgram(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProgram}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}