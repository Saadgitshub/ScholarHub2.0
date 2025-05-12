"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, GraduationCap, Users, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface Subject {
  id: number
  name: string
  levelName: string
}

interface Student {
  id: number
  firstname: string
  lastname: string
  level: { id: number; name: string }
  group: { id: number; name: string }
}

interface Grade {
  id: number
  score: number
  student: { id: number }
  subject: { id: number; name: string }
}

interface Assignment {
  id: number
  title: string
  description: string
  delay: string // ISO date string
  subjectId: number
  groupId: number
  programId: number
}

interface Schedule {
  subject: { id: number; name: string }
  time: string
  room: string
  studentCount: number
}

interface Program {
  id: number
  teacher: { id: number; firstname: string; lastname: string }
  group: { id: number; name: string; level: { id: number; name: string } }
  subject: { id: number; name: string; levelName: string }
}

const BACKEND_URL = "http://localhost:8080/api"

export default function TeacherDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)

  // Convert score to GPA
  const scoreToGpa = (score: number): number => {
    if (score >= 90) return 4.0
    if (score >= 80) return 3.0
    if (score >= 70) return 2.0
    if (score >= 60) return 1.0
    return 0.0
  }

  // Convert score to letter grade
  const scoreToLetterGrade = (score: number): string => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  const fetchSubjects = async () => {
    try {
      console.log(`[DEBUG] Fetching subjects from ${BACKEND_URL}/subjects`)
      const response = await fetch(`${BACKEND_URL}/subjects`, {
        headers: { "Accept": "application/json" }
      })
      console.log(`[DEBUG] Subjects fetch status: ${response.status} ${response.statusText}`)
      console.log(`[DEBUG] Subjects fetch headers:`, Object.fromEntries(response.headers.entries()))
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
            levelName: subject.levelName || subject.level?.name || "N/A",
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

  const fetchStudents = async () => {
    try {
      console.log(`[DEBUG] Fetching students from ${BACKEND_URL}/students`)
      const response = await fetch(`${BACKEND_URL}/students`, {
        headers: { "Accept": "application/json" }
      })
      console.log(`[DEBUG] Students fetch status: ${response.status} ${response.statusText}`)
      console.log(`[DEBUG] Students fetch headers:`, Object.fromEntries(response.headers.entries()))
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Students fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch students: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Students response:`, data)
      const normalizedStudents = Array.isArray(data)
        ? data.map((student: any) => ({
            id: student.id || 0,
            firstname: student.firstname || "Unknown",
            lastname: student.lastname || "Student",
            level: {
              id: student.level?.id || 0,
              name: student.level?.name || student.levelName || "N/A",
            },
            group: {
              id: student.group?.id || 0,
              name: student.group?.name || student.groupName || "N/A",
            },
          }))
        : []
      setStudents(normalizedStudents)
      if (normalizedStudents.length === 0) {
        console.log(`[DEBUG] No students found`)
        toast({ title: "No Students", description: "No students found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching students:`, error)
      setError(error instanceof Error ? error.message : "Failed to load students")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load students",
        variant: "destructive",
      })
    }
  }

  const fetchGrades = async () => {
    try {
      console.log(`[DEBUG] Fetching grades from ${BACKEND_URL}/grades`)
      const response = await fetch(`${BACKEND_URL}/grades`, {
        headers: { "Accept": "application/json" }
      })
      console.log(`[DEBUG] Grades fetch status: ${response.status} ${response.statusText}`)
      console.log(`[DEBUG] Grades fetch headers:`, Object.fromEntries(response.headers.entries()))
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Grades fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch grades: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Grades response:`, data)
      const normalizedGrades = Array.isArray(data)
        ? data.map((grade: any) => ({
            id: grade.id || 0,
            score: grade.score || 0,
            student: { id: grade.student?.id || 0 },
            subject: {
              id: grade.subject?.id || 0,
              name: grade.subject?.name || "Unknown Subject",
            },
          }))
        : []
      setGrades(normalizedGrades)
      if (normalizedGrades.length === 0) {
        console.log(`[DEBUG] No grades found`)
        toast({ title: "No Grades", description: "No grades found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching grades:`, error)
      setError(error instanceof Error ? error.message : "Failed to load grades")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load grades",
        variant: "destructive",
      })
    }
  }

  const fetchPrograms = async () => {
    try {
      console.log(`[DEBUG] Fetching programs from ${BACKEND_URL}/programs`)
      const response = await fetch(`${BACKEND_URL}/programs`, {
        headers: { "Accept": "application/json" }
      })
      console.log(`[DEBUG] Programs fetch status: ${response.status} ${response.statusText}`)
      console.log(`[DEBUG] Programs fetch headers:`, Object.fromEntries(response.headers.entries()))
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

  const fetchAssignments = async () => {
    setIsLoadingAssignments(true)
    setAssignmentError(null)
    try {
      // Get unique groupIds from students
      const groupIds = Array.from(new Set(students.map((student) => student.group.id).filter((id) => id > 0)))
      console.log(`[DEBUG] Group IDs from students:`, groupIds)

      if (groupIds.length === 0) {
        console.log(`[DEBUG] No valid group IDs from students, trying default groupId=1`)
        // Fallback to groupId=1
        const response = await fetch(`${BACKEND_URL}/assignments?groupId=1`, {
          headers: { "Accept": "application/json" }
        })
        console.log(`[DEBUG] Assignments fetch status (groupId=1): ${response.status} ${response.statusText}`)
        console.log(`[DEBUG] Assignments fetch headers:`, Object.fromEntries(response.headers.entries()))
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[DEBUG] Assignments fetch error response: ${errorText}`)
          throw new Error(`Failed to fetch assignments: ${errorText}`)
        }
        const data = await response.json()
        console.log(`[DEBUG] Assignments response (groupId=1):`, data)
        const normalizedAssignments = Array.isArray(data)
          ? data.map((assignment: any) => ({
              id: assignment.id || 0,
              title: assignment.title || "Unknown Assignment",
              description: assignment.description || "",
              delay: assignment.delay || new Date().toISOString(),
              subjectId: assignment.subjectId || 0,
              groupId: assignment.groupId || 1,
              programId: assignment.programId || 0,
            }))
          : []
        setAssignments(normalizedAssignments)
        if (normalizedAssignments.length === 0) {
          console.log(`[DEBUG] No assignments found for groupId=1`)
          toast({ title: "No Assignments", description: "No assignments found for group ID 1." })
        }
        return
      }

      // Fetch assignments for each group
      console.log(`[DEBUG] Fetching assignments for groupIds:`, groupIds)
      const allAssignments: Assignment[] = []
      for (const groupId of groupIds) {
        console.log(`[DEBUG] Fetching assignments for groupId=${groupId}`)
        const response = await fetch(`${BACKEND_URL}/assignments?groupId=${groupId}`, {
          headers: { "Accept": "application/json" }
        })
        console.log(`[DEBUG] Assignments fetch status (groupId=${groupId}): ${response.status} ${response.statusText}`)
        console.log(`[DEBUG] Assignments fetch headers:`, Object.fromEntries(response.headers.entries()))
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[DEBUG] Assignments fetch error response (groupId=${groupId}): ${errorText}`)
          throw new Error(`Failed to fetch assignments for group ${groupId}: ${errorText}`)
        }
        const data = await response.json()
        console.log(`[DEBUG] Assignments response (groupId=${groupId}):`, data)
        const normalizedAssignments = Array.isArray(data)
          ? data.map((assignment: any) => ({
              id: assignment.id || 0,
              title: assignment.title || "Unknown Assignment",
              description: assignment.description || "",
              delay: assignment.delay || new Date().toISOString(),
              subjectId: assignment.subjectId || 0,
              groupId: assignment.groupId || groupId,
              programId: assignment.programId || 0,
            }))
          : []
        allAssignments.push(...normalizedAssignments)
      }
      setAssignments(allAssignments)
      if (allAssignments.length === 0) {
        console.log(`[DEBUG] No assignments found for any groups`)
        toast({ title: "No Assignments", description: "No assignments found for your groups." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching assignments:`, error)
      setAssignmentError(error instanceof Error ? error.message : "Failed to load assignments")
      setAssignments([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load assignments",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAssignments(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all([
          fetchSubjects(),
          fetchStudents(),
          fetchGrades(),
          fetchPrograms(),
        ])
        // Fetch assignments after students to use groupIds
        await fetchAssignments()
      } catch (error) {
        console.error(`[DEBUG] Error in fetch sequence:`, error)
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
        console.log(`[DEBUG] Fetch completed, isLoading: false`)
      }
    }
    fetchData()
  }, [])

  // Compute derived data
  const assignmentCount = assignments.length
  const ungradedAssignments = assignments.length // Assume all fetched assignments need grading
  const studentCount = students.length
  const subjectCount = subjects.length
  const averageGpa = grades.length > 0
    ? grades.reduce((sum, grade) => sum + scoreToGpa(grade.score), 0) / grades.length
    : 0
  const averageLetterGrade = averageGpa
    ? scoreToLetterGrade(
        grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length
      )
    : "N/A"

  // Compute programs with student count
  const programsWithStudentCount = programs.map((program) => {
    const programStudents = students.filter((student) => student.group.id === program.group.id)
    return {
      ...program,
      studentCount: programStudents.length,
    }
  })

  // Generate static schedule from subjects
  const staticSchedule: Schedule[] = subjects.map((subject, index) => ({
    subject: { id: subject.id, name: subject.name },
    time: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(), // Next few days
    room: `Room ${index + 101}`,
    studentCount: programsWithStudentCount.find((p) => p.subject.id === subject.id)?.studentCount || 0,
  }))

  // Map subjectId to subject name
  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : "Unknown Subject"
  }

  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Ms. Johnson! Here's an overview of your classes and assignments.
        </p>
      </div>
      {isLoading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignmentCount}</div>
                <p className="text-xs text-muted-foreground">{ungradedAssignments} need grading</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentCount}</div>
                <p className="text-xs text-muted-foreground">Across {programs.length} programs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageLetterGrade}</div>
                <p className="text-xs text-muted-foreground">{averageGpa.toFixed(1)} GPA average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Taught</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87</div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Assignments Needing Grading</CardTitle>
                <CardDescription>Recently submitted assignments that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingAssignments && <p>Loading assignments...</p>}
                  {assignmentError && <p style={{ color: "red" }}>{assignmentError}</p>}
                  {!isLoadingAssignments && !assignmentError && assignments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No assignments need grading.</p>
                  ) : (
                    assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {getSubjectName(assignment.subjectId)} - Due: {formatDate(assignment.delay)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Link href={`/dashboard/teacher/grades?assignmentId=${assignment.id}`}>
                            <Button
                              size="sm"
                              onClick={() => console.log(`[DEBUG] Navigating to grades for assignmentId=${assignment.id}`)}
                            >
                              Grade
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your schedule for the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staticSchedule.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming classes.</p>
                  ) : (
                    staticSchedule.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{item.subject.name}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(item.time)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{item.room}</div>
                          <div className="flex items-center text-sm">
                            <Users className="mr-1 h-3 w-3" />
                            {item.studentCount}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programsWithStudentCount.length === 0 ? (
              <p className="text-sm text-muted-foreground">No programs found.</p>
            ) : (
              programsWithStudentCount.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <CardTitle>{program.subject.name}</CardTitle>
                    <CardDescription>Program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Students:</span>
                        <span className="text-sm">{program.studentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Level:</span>
                        <span className="text-sm">{program.subject.levelName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Group:</span>
                        <span className="text-sm">{program.group.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Teacher:</span>
                        <span className="text-sm">{`${program.teacher.firstname} ${program.teacher.lastname}`}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex border-t p-4">
                    <Link href={`/dashboard/teacher/students?group=${program.group.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Students
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent activity on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Created Assignment",
                    details: "Lab Report: Wave Properties for Physics 101",
                    timestamp: "Today, 9:30 AM",
                  },
                  {
                    action: "Graded Assignment",
                    details: "Midterm Exam for Alex Johnson",
                    timestamp: "Yesterday, 4:45 PM",
                  },
                  {
                    action: "Added Comment",
                    details: "On Jamie Smith's Lab Report",
                    timestamp: "Yesterday, 2:20 PM",
                  },
                  {
                    action: "Updated Class Schedule",
                    details: "Physics 201 moved to Science Hall 203",
                    timestamp: "Apr 18, 2025, 10:15 AM",
                  },
                  {
                    action: "Created Exam",
                    details: "Final Exam for Physics 101",
                    timestamp: "Apr 17, 2025, 3:30 PM",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}