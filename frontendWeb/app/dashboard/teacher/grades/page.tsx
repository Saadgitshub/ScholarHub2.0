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

type WorkReturn = {
  id: number
  studentId: number
  assignmentId: number
  fileUrl: string
  grade?: number
  studentName: string
  subjectName: string
  assignmentName: string
}

type Student = { id: number; firstname: string; lastname: string }
type Subject = { id: number; name: string }
type Assignment = {
  id: number
  title: string
  description: string
  delay: string
  subjectId: number
  groupId: number
  programId: number
}

const BASE_URL = "http://localhost:8080"
const API_URL = `${BASE_URL}/api`
const GROUP_ID = 1 // Placeholder; replace with teacher auth context

export default function AddGradeForm() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [workReturns, setWorkReturns] = useState<WorkReturn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newGrade, setNewGrade] = useState<{
    id: number
    score: number
    workReturnId: number
    studentName: string
    subjectName: string
    assignmentName: string
  }>({
    id: 0,
    score: 0,
    workReturnId: 0,
    studentName: "",
    subjectName: "",
    assignmentName: "",
  })

  const loadReferenceData = async () => {
    try {
      console.log(`[DEBUG] Fetching reference data from ${API_URL}`)
      const [studentsRes, subjectsRes, assignmentsRes] = await Promise.all([
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/subjects`),
        fetch(`${API_URL}/assignments/all`),
      ])

      console.log(`[DEBUG] Students fetch status: ${studentsRes.status} ${studentsRes.statusText}`)
      console.log(`[DEBUG] Subjects fetch status: ${subjectsRes.status} ${subjectsRes.statusText}`)
      console.log(`[DEBUG] Assignments fetch status: ${assignmentsRes.status} ${assignmentsRes.statusText}`)

      if (!studentsRes.ok) {
        const errorText = await studentsRes.text()
        console.error(`[DEBUG] Students fetch error response: ${errorText}`)
        throw new Error("Failed to fetch students")
      }
      if (!subjectsRes.ok) {
        const errorText = await subjectsRes.text()
        console.error(`[DEBUG] Subjects fetch error response: ${errorText}`)
        throw new Error("Failed to fetch subjects")
      }
      if (!assignmentsRes.ok) {
        const errorText = await assignmentsRes.text()
        console.error(`[DEBUG] Assignments fetch error response: ${errorText}`)
        throw new Error("Failed to fetch assignments")
      }

      const [studentsData, subjectsData, assignmentsData] = await Promise.all([
        studentsRes.json(),
        subjectsRes.json(),
        assignmentsRes.json(),
      ])

      console.log(`[DEBUG] Students response:`, studentsData)
      console.log(`[DEBUG] Subjects response:`, subjectsData)
      console.log(`[DEBUG] Assignments response:`, assignmentsData)

      setStudents(Array.isArray(studentsData) ? studentsData : [])
      setSubjects(Array.isArray(subjectsData) ? subjectsData : [])
      setAssignments(
        Array.isArray(assignmentsData)
          ? assignmentsData.map((a: any) => ({
              id: a.id,
              title: a.title,
              description: a.description,
              delay: a.delay,
              subjectId: a.subjectId || a.subject?.id || 0,
              groupId: a.groupId || a.group?.id || 0,
              programId: a.programId || a.program?.id || 0,
            }))
          : []
      )

      return { studentsData, subjectsData, assignmentsData }
    } catch (error) {
      console.error(`[DEBUG] Error loading reference data:`, error)
      setError(error instanceof Error ? error.message : "Failed to load reference data")
      return { studentsData: [], subjectsData: [], assignmentsData: [] }
    }
  }

  const loadAndEnrichWorkReturns = async (referenceData: {
    studentsData: Student[]
    subjectsData: Subject[]
    assignmentsData: Assignment[]
  }) => {
    try {
      console.log(`[DEBUG] Fetching work returns from ${API_URL}/workreturns?groupId=${GROUP_ID}`)
      const workReturnsRes = await fetch(`${API_URL}/workreturns?groupId=${GROUP_ID}`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] WorkReturns fetch status: ${workReturnsRes.status} ${workReturnsRes.statusText}`)

      if (!workReturnsRes.ok) {
        const errorText = await workReturnsRes.text()
        console.error(`[DEBUG] WorkReturns fetch error response: ${errorText}`)
        throw new Error("Failed to fetch work returns")
      }

      const workReturnsData = await workReturnsRes.json()
      console.log(`[DEBUG] WorkReturns raw response:`, workReturnsData)

      const enrichedWorkReturns = Array.isArray(workReturnsData)
        ? workReturnsData.map((wr: any) => {
            const student = referenceData.studentsData.find(
              (s) => s.id === (wr.studentId || wr.student?.id)
            )
            const assignment = referenceData.assignmentsData.find(
              (a) => a.id === (wr.assignmentId || wr.assignment?.id)
            )
            const subject = referenceData.subjectsData.find(
              (s) => s.id === (assignment?.subjectId || wr.assignment?.subject?.id)
            )

            console.log(
              `[DEBUG] Enriching work return id ${wr.id}: studentId=${
                wr.studentId || wr.student?.id
              }, assignmentId=${wr.assignmentId || wr.assignment?.id}, status=${
                wr.assignment?.status
              }, groupId=${assignment?.groupId}, fileUrl=${wr.filePath}`
            )

            return {
              id: wr.id,
              studentId: wr.studentId || wr.student?.id || 0,
              assignmentId: wr.assignmentId || wr.assignment?.id || 0,
              fileUrl: wr.filePath || wr.fileUrl || "",
              grade: wr.grade || undefined,
              studentName: student
                ? `${student.firstname} ${student.lastname}`
                : "Unknown Student",
              subjectName: subject?.name || "Unknown Subject",
              assignmentName: assignment?.title || "Unknown Assignment",
            }
          })
        : []

      setWorkReturns(enrichedWorkReturns)
      console.log(`[DEBUG] Enriched work returns:`, enrichedWorkReturns)
      if (enrichedWorkReturns.length === 0) {
        console.log(`[DEBUG] No work returns found after enrichment`)
        toast({
          title: "No Work Returns",
          description: "No submitted work returns found.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error(`[DEBUG] Error loading work returns:`, error)
      setError(error instanceof Error ? error.message : "Failed to load work returns")
      setWorkReturns([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load work returns",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (workReturnId: number, fileName: string) => {
    try {
      console.log(`[DEBUG] Downloading file from ${API_URL}/workreturns/${workReturnId}/download`)
      const response = await fetch(`${API_URL}/workreturns/${workReturnId}/download`, {
        method: "GET",
        headers: { "Accept": "*/*" },
      })
      console.log(`[DEBUG] Download status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Download error response: ${errorText}`)
        throw new Error("Failed to download file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName || "submission"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      console.log(`[DEBUG] File downloaded successfully: ${fileName}`)
      toast({
        title: "Success",
        description: "File downloaded successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error downloading file:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download file",
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
        await loadAndEnrichWorkReturns(referenceData)
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

    if (!newGrade.workReturnId) {
      toast({
        title: "Error",
        description: "Please select a work return to grade",
        variant: "destructive",
      })
      return
    }

    const workReturnToUpdate = {
      id: newGrade.workReturnId,
      grade: newGrade.score,
    }

    try {
      console.log(`[DEBUG] Updating work return:`, workReturnToUpdate)
      const res = await fetch(`${API_URL}/workreturns/${newGrade.workReturnId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workReturnToUpdate),
      })

      console.log(`[DEBUG] WorkReturn update status: ${res.status} ${res.statusText}`)
      if (!res.ok) {
        const responseText = await res.text()
        let errorMessage = "Failed to update work return"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] WorkReturn update error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const updatedWorkReturn = await res.json()
      console.log(`[DEBUG] Updated work return:`, updatedWorkReturn)

      const referenceData = { studentsData: students, subjectsData: subjects, assignmentsData: assignments }
      await loadAndEnrichWorkReturns(referenceData)

      setNewGrade({
        id: 0,
        score: 0,
        workReturnId: 0,
        studentName: "",
        subjectName: "",
        assignmentName: "",
      })

      toast({
        title: "Success",
        description: "Work return graded successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error updating work return:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to grade work return",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (workReturn: WorkReturn) => {
    setNewGrade({
      id: workReturn.id,
      score: workReturn.grade || 0,
      workReturnId: workReturn.id,
      studentName: workReturn.studentName,
      subjectName: workReturn.subjectName,
      assignmentName: workReturn.assignmentName,
    })
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting work return grade id: ${id}`)
      const res = await fetch(`${API_URL}/workreturns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, grade: null }),
      })

      console.log(`[DEBUG] Delete grade status: ${res.status} ${res.statusText}`)
      if (!res.ok) {
        const responseText = await res.text()
        let errorMessage = "Failed to delete grade"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.error(`[DEBUG] Delete grade error response:`, errorData)
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText)
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const referenceData = { studentsData: students, subjectsData: subjects, assignmentsData: assignments }
      await loadAndEnrichWorkReturns(referenceData)

      toast({
        title: "Success",
        description: "Grade removed successfully!",
      })
    } catch (error) {
      console.error(`[DEBUG] Error deleting grade:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove grade",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Grades</h1>
        <p className="text-muted-foreground">Grade or review student work return submissions.</p>
      </div>

      {isLoading && <p>Loading work returns...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{newGrade.id ? "Edit Grade" : "Add Grade"}</CardTitle>
          <CardDescription>Fill in the details to {newGrade.id ? "update" : "create"} a grade for a work return.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                placeholder="Enter score (0-100)"
                value={newGrade.score}
                onChange={(e) => setNewGrade({ ...newGrade, score: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workReturnId">Work Return</Label>
              <select
                id="workReturnId"
                value={newGrade.workReturnId}
                onChange={(e) => {
                  const wr = workReturns.find((wr) => wr.id === Number(e.target.value))
                  setNewGrade({
                    ...newGrade,
                    workReturnId: Number(e.target.value),
                    studentName: wr?.studentName || "",
                    subjectName: wr?.subjectName || "",
                    assignmentName: wr?.assignmentName || "",
                  })
                }}
                required
                className="w-full border rounded-md p-2"
              >
                <option value={0} disabled>Select Work Return</option>
                {workReturns.length === 0 ? (
                  <option disabled>No work returns available</option>
                ) : (
                  workReturns.map((wr) => (
                    <option key={wr.id} value={wr.id}>
                      {wr.studentName} - {wr.assignmentName}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="space-x-2">
              <Button type="submit">{newGrade.id ? "Update Grade" : "Add Grade"}</Button>
              {newGrade.id !== 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setNewGrade({
                      id: 0,
                      score: 0,
                      workReturnId: 0,
                      studentName: "",
                      subjectName: "",
                      assignmentName: "",
                    })
                  }
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {workReturns.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No work returns found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workReturns.map((wr) => (
            <Card key={wr.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{wr.assignmentName}</CardTitle>
                <CardDescription>{wr.studentName}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p><strong>Subject:</strong> {wr.subjectName}</p>
                <p><strong>Score:</strong> {wr.grade !== undefined ? wr.grade : "Not graded"}</p>
                <p>
                  <strong>Submission:</strong>{" "}
                  <a
                    href={`${BASE_URL}${wr.fileUrl}`}
                    download={wr.fileUrl.split("/").pop()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => console.log(`[DEBUG] Download link clicked: ${BASE_URL}${wr.fileUrl}`)}
                  >
                    Download File
                  </a>
                  {" | "}
                  <Button
                    variant="link"
                    onClick={() => handleDownload(wr.id, wr.fileUrl.split("/").pop() || "submission")}
                  >
                    Download
                  </Button>
                </p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(wr)}>Edit</Button>
                {wr.grade !== undefined && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Remove Grade</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Grade Removal</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove the grade for "{wr.studentName}" on "
                          {wr.assignmentName}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(wr.id)}>
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}