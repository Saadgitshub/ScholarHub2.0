"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, FileText, GraduationCap, Users } from "lucide-react"

interface Assignment {
  id: number
  subject: { id: number; name: string; levelName: string }
  title: string
  dueDate: string
  status: "SUBMITTED" | "IN_PROGRESS" | "NOT_STARTED"
}

interface Grade {
  id: number
  subject: { id: number; name: string; levelName: string }
  assignment: { id: number; title: string }
  grade: string
  score: string
}

interface Program {
  id: number
  teacher: { id: number; firstname: string; lastname: string }
  group: { id: number; name: string; level: { id: number; name: string } }
  subject: { id: number; name: string; levelName: string }
}

interface Student {
  id: number
  firstname: string
  lastname: string
  group: { id: number; name: string; level: { id: number; name: string } }
}

const BACKEND_URL = "http://localhost:8080/api"
const STUDENT_ID = 1 // Placeholder; replace with auth context

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [classes, setClasses] = useState<Program[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudent = async () => {
    try {
      console.log(`[DEBUG] Fetching student from ${BACKEND_URL}/students/${STUDENT_ID}`)
      const response = await fetch(`${BACKEND_URL}/students/${STUDENT_ID}`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Student fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Student fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch student: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Student response:`, data)
      setStudent({
        id: data.id || STUDENT_ID,
        firstname: data.firstname || "Unknown",
        lastname: data.lastname || "Student",
        group: {
          id: data.group?.id || 1,
          name: data.group?.name || "Unknown Group",
          level: {
            id: data.group?.level?.id || 0,
            name: data.group?.level?.name || "N/A",
          },
        },
      })
    } catch (error) {
      console.error(`[DEBUG] Error fetching student:`, error)
      setError(error instanceof Error ? error.message : "Failed to load student data")
      setStudent({
        id: STUDENT_ID,
        firstname: "Alex",
        lastname: "Smith",
        group: { id: 1, name: "Group B", level: { id: 2, name: "Level 2" } },
      })
    }
  }

  const fetchAssignments = async (groupId: number) => {
    try {
      console.log(`[DEBUG] Fetching assignments from ${BACKEND_URL}/assignments?groupId=${groupId}`)
      const response = await fetch(`${BACKEND_URL}/assignments?groupId=${groupId}`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Assignments fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Assignments fetch error response: ${errorText}`)
        throw new Error(`Failed to fetch assignments: ${errorText}`)
      }
      const data = await response.json()
      console.log(`[DEBUG] Assignments response:`, data)
      const normalizedAssignments = Array.isArray(data)
        ? data.map((assignment: any) => {
            const status = (assignment.status || "NOT_STARTED").toUpperCase()
            console.log(`[DEBUG] Assignment ID: ${assignment.id}, Status: ${status}`)
            return {
              id: assignment.id || 0,
              subject: {
                id: assignment.subject?.id || 0,
                name: assignment.subject?.name || "Unknown Subject",
                levelName: assignment.subject?.levelName || "N/A",
              },
              title: assignment.title || "Untitled",
              dueDate: assignment.dueDate || "N/A",
              status: status as "SUBMITTED" | "IN_PROGRESS" | "NOT_STARTED",
            }
          })
        : []
      setAssignments(normalizedAssignments)
    } catch (error) {
      console.error(`[DEBUG] Error fetching assignments:`, error)
      setError(error instanceof Error ? error.message : "Failed to load assignments")
    }
  }

  const fetchGrades = async (groupId: number) => {
    try {
      console.log(`[DEBUG] Fetching grades from ${BACKEND_URL}/grades?groupId=${groupId}`)
      const response = await fetch(`${BACKEND_URL}/grades?groupId=${groupId}`, {
        headers: { "Accept": "application/json" },
      })
      console.log(`[DEBUG] Grades fetch status: ${response.status} ${response.statusText}`)
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
            subject: {
              id: grade.subject?.id || 0,
              name: grade.subject?.name || "Unknown Subject",
              levelName: grade.subject?.levelName || "N/A",
            },
            assignment: {
              id: grade.assignment?.id || 0,
              title: grade.assignment?.title || "Untitled",
            },
            grade: grade.grade || "N/A",
            score: grade.score || "N/A",
          }))
        : []
      setGrades(normalizedGrades)
    } catch (error) {
      console.error(`[DEBUG] Error fetching grades:`, error)
      setError(error instanceof Error ? error.message : "Failed to load grades")
    }
  }

  const fetchClasses = async (groupId: number) => {
    try {
      console.log(`[DEBUG] Fetching programs from ${BACKEND_URL}/programs?groupId=${groupId}`)
      const response = await fetch(`${BACKEND_URL}/programs?groupId=${groupId}`, {
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
              id: program.group?.id || groupId,
              name: program.group?.name || "Unknown Group",
              level: {
                id: groupId,
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
      setClasses(normalizedPrograms)
    } catch (error) {
      console.error(`[DEBUG] Error fetching classes:`, error)
      setError(error instanceof Error ? error.message : "Failed to load classes")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await fetchStudent()
      } catch (error) {
        console.error(`[DEBUG] Error fetching student data:`, error)
      }
      const groupId = student?.group.id || 1
      try {
        await Promise.all([
          fetchAssignments(groupId),
          fetchGrades(groupId),
          fetchClasses(groupId),
        ])
      } catch (error) {
        console.error(`[DEBUG] Error in fetch sequence:`, error)
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
        console.log(`[DEBUG] Fetch completed, isLoading: false`)
      }
    }
    fetchData()
  }, [student?.group.id])

  const today = new Date()
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const assignmentsDueThisWeek = assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    return dueDate >= today && dueDate <= oneWeekFromNow
  }).length

  const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  const upcomingAssignments = assignments
    .filter((assignment) => {
      const dueDate = new Date(assignment.dueDate)
      return dueDate >= today && dueDate <= twoWeeksFromNow
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const recentAssignments = assignments
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3)

  const recentGrades = grades
    .sort((a, b) => b.id - a.id)
    .slice(0, 4)

  const groupInfo = classes.length > 0 ? classes[0].group : { name: "Group B", level: { name: "Level 2" } }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {student?.firstname || "Alex"}! Here's an overview of your academic progress.</p>
      </div>
      {isLoading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <p className="text-xs text-muted-foreground">{assignmentsDueThisWeek} due this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8</div>
                <p className="text-xs text-muted-foreground">+0.2 from last semester</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
                <p className="text-xs text-muted-foreground">{`${groupInfo.level.name} - ${groupInfo.name}`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">2 absences this semester</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>Your most recent assignments and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAssignments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent assignments.</p>
                  ) : (
                    recentAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">{assignment.subject.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{assignment.dueDate}</div>
                          <div
                            className={`text-sm font-medium ${
                              assignment.status === "SUBMITTED"
                                ? "text-green-500"
                                : assignment.status === "IN_PROGRESS"
                                ? "text-amber-500"
                                : "text-red-500"
                            }`}
                          >
                            {assignment.status.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Your most recent grades and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent grades.</p>
                  ) : (
                    recentGrades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{grade.assignment.title}</p>
                          <p className="text-sm text-muted-foreground">{grade.subject.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{grade.score}</div>
                          <div className="text-sm font-bold">{grade.grade}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Assignments due in the next two weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming assignments.</p>
                ) : (
                  upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.subject.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">{assignment.dueDate}</div>
                        <div
                          className={`text-sm font-medium ${
                            assignment.status === "SUBMITTED"
                              ? "text-green-500"
                              : assignment.status === "IN_PROGRESS"
                              ? "text-amber-500"
                              : "text-red-500"
                            }`}
                        >
                          {assignment.status.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>Exams scheduled in the next month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    subject: "Mathematics",
                    title: "Final Exam",
                    date: "May 15, 2025",
                    location: "Room 101",
                  },
                  {
                    subject: "Physics",
                    title: "Final Exam",
                    date: "May 18, 2025",
                    location: "Science Hall",
                  },
                  {
                    subject: "English Literature",
                    title: "Final Paper Due",
                    date: "May 20, 2025",
                    location: "Online Submission",
                  },
                ].map((exam, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{exam.title}</p>
                      <p className="text-sm text-muted-foreground">{exam.subject}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{exam.date}</div>
                      <div className="text-sm">{exam.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                    action: "Submitted Assignment",
                    details: "Calculus Problem Set 3",
                    timestamp: "Today, 10:30 AM",
                  },
                  {
                    action: "Viewed Grade",
                    details: "Physics Lab Report: Mechanics",
                    timestamp: "Yesterday, 3:45 PM",
                  },
                  {
                    action: "Started Assignment",
                    details: "Essay on Shakespeare",
                    timestamp: "Yesterday, 1:20 PM",
                  },
                  {
                    action: "Downloaded Resource",
                    details: "Computer Science Lecture Notes",
                    timestamp: "Apr 18, 2025, 9:15 AM",
                  },
                  {
                    action: "Commented on Discussion",
                    details: "History Class Forum",
                    timestamp: "Apr 17, 2025, 2:30 PM",
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