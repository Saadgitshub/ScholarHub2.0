"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Users, Settings, Bell, School, Layers } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface SubjectPerformance {
  subject: string
  averageGrade: string
  passingRate: string
  trend: string
}

interface Teacher {
  id: number
  name: string
  department: string
  classes: number
  students: number
}

interface Student {
  id: number
  name: string
  level: string
  group: string
  gpa: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0)
  const [teacherCount, setTeacherCount] = useState(0)
  const [subjectCount, setSubjectCount] = useState(0)
  const [averageGpa, setAverageGpa] = useState(0)
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert score (0-100) to GPA (0-4.0)
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

  const fetchStudents = async () => {
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
      setStudentCount(Array.isArray(data) ? data.length : 0)
      if (data.length === 0) {
        console.log(`[DEBUG] No students found`)
        toast({ title: "No Students", description: "No students found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching students:`, error)
      setError(error instanceof Error ? error.message : "Failed to load students")
      setStudentCount(0)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load students",
        variant: "destructive",
      })
    }
  }

  const fetchTeachers = async () => {
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
      const normalizedTeachers = Array.isArray(data)
        ? data.slice(0, 3).map((teacher: any) => ({
            id: teacher.id || 0,
            name: `${teacher.firstname || ""} ${teacher.lastname || ""}`.trim() || "Unknown Teacher",
            department: teacher.department || "General",
            classes: teacher.classCount || 0,
            students: teacher.studentCount || 0,
          }))
        : []
      setTeachers(normalizedTeachers)
      setTeacherCount(data.length || 0)
      if (data.length === 0) {
        console.log(`[DEBUG] No teachers found`)
        toast({ title: "No Teachers", description: "No teachers found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching teachers:`, error)
      setError(error instanceof Error ? error.message : "Failed to load teachers")
      setTeachers([])
      setTeacherCount(0)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load teachers",
        variant: "destructive",
      })
    }
  }

  const fetchSubjects = async () => {
    try {
      console.log(`[DEBUG] Fetching subjects from ${BACKEND_URL}/subjects`)
      const response = await fetch(`${BACKEND_URL}/subjects`)
      console.log(`[DEBUG] Subjects fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Subjects fetch error response: ${errorText}`)
        throw new Error("Failed to fetch subjects")
      }
      const data = await response.json()
      console.log(`[DEBUG] Subjects response:`, data)
      setSubjectCount(Array.isArray(data) ? data.length : 0)
      if (data.length === 0) {
        console.log(`[DEBUG] No subjects found`)
        toast({ title: "No Subjects", description: "No subjects found in the system." })
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching subjects:`, error)
      setError(error instanceof Error ? error.message : "Failed to load subjects")
      setSubjectCount(0)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load subjects",
        variant: "destructive",
      })
    }
  }

  const fetchGrades = async () => {
    try {
      console.log(`[DEBUG] Fetching grades from ${BACKEND_URL}/grades`)
      const response = await fetch(`${BACKEND_URL}/grades`)
      console.log(`[DEBUG] Grades fetch status: ${response.status} ${response.statusText}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[DEBUG] Grades fetch error response: ${errorText}`)
        throw new Error("Failed to fetch grades")
      }
      const data = await response.json()
      console.log(`[DEBUG] Grades response:`, data)
      
      if (Array.isArray(data) && data.length > 0) {
        const totalScore = data.reduce((sum: number, grade: any) => sum + (grade.score || 0), 0)
        const avgScore = totalScore / data.length
        setAverageGpa(scoreToGpa(avgScore))
      } else {
        setAverageGpa(0)
        console.log(`[DEBUG] No grades found`)
        toast({ title: "No Grades", description: "No grades found in the system." })
      }

      const subjectMap: { [key: string]: { scores: number[]; name: string } } = {}
      data.forEach((grade: any) => {
        const subjectId = grade.subject?.id || 0
        const subjectName = grade.subject?.name || "Unknown Subject"
        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = { scores: [], name: subjectName }
        }
        if (grade.score) {
          subjectMap[subjectId].scores.push(grade.score)
        }
      })

      const performance = Object.values(subjectMap).map((subject) => {
        const avgScore = subject.scores.length > 0 
          ? subject.scores.reduce((sum, score) => sum + score, 0) / subject.scores.length 
          : 0
        const passingRate = subject.scores.length > 0 
          ? ((subject.scores.filter((score) => score >= 60).length / subject.scores.length) * 100).toFixed(0) + "%"
          : "0%"
        return {
          subject: subject.name,
          averageGrade: scoreToLetterGrade(avgScore),
          passingRate,
          trend: "0%",
        }
      })
      setSubjectPerformance(performance)

      const studentGrades: { [key: number]: number[] } = {}
      data.forEach((grade: any) => {
        const studentId = grade.student?.id || 0
        if (!studentGrades[studentId]) {
          studentGrades[studentId] = []
        }
        if (grade.score) {
          studentGrades[studentId].push(grade.score)
        }
      })

      const studentResponse = await fetch(`${BACKEND_URL}/students`)
      if (!studentResponse.ok) {
        throw new Error("Failed to fetch students for GPA")
      }
      const studentData = await studentResponse.json()
      const normalizedStudents = Array.isArray(studentData)
        ? studentData.slice(0, 3).map((student: any) => {
            const scores = studentGrades[student.id] || []
            const avgScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
            return {
              id: student.id || 0,
              name: `${student.firstname || ""} ${student.lastname || ""}`.trim() || "Unknown Student",
              level: student.level?.name || student.levelName || "Unknown Level",
              group: student.group?.name || student.groupName || "Unknown Group",
              gpa: avgScore ? scoreToGpa(avgScore).toFixed(1) : "N/A",
            }
          })
        : []
      setStudents(normalizedStudents)
    } catch (error) {
      console.error(`[DEBUG] Error fetching grades:`, error)
      setError(error instanceof Error ? error.message : "Failed to load grades")
      setAverageGpa(0)
      setSubjectPerformance([])
      setStudents([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load grades",
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
          fetchStudents(),
          fetchTeachers(),
          fetchSubjects(),
          fetchGrades(),
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
  }, [])

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Administrator! Here's an overview of your school.
        </p>
      </div>
      {isLoading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentCount}</div>
                <p className="text-xs text-muted-foreground">Updated today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherCount}</div>
                <p className="text-xs text-muted-foreground">Updated today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjectCount}</div>
                <p className="text-xs text-muted-foreground">Updated today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageGpa.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Current semester</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>School Performance</CardTitle>
                <CardDescription>Academic performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectPerformance.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No performance data available.</p>
                  ) : (
                    subjectPerformance.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{subject.subject}</p>
                          <p className="text-sm text-muted-foreground">Avg. Grade: {subject.averageGrade}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">Passing: {subject.passingRate}</div>
                          <div className="text-sm text-muted-foreground">{subject.trend}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest administrative actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New Teacher Added",
                      details: "Dr. Sarah Johnson - Physics",
                      timestamp: "Today, 10:30 AM",
                    },
                    {
                      action: "Subject Schedule Updated",
                      details: "Spring Semester 2025",
                      timestamp: "Yesterday, 3:45 PM",
                    },
                    {
                      action: "System Maintenance",
                      details: "Database optimization completed",
                      timestamp: "Yesterday, 1:20 AM",
                    },
                    {
                      action: "New Student Enrolled",
                      details: "15 new students added to system",
                      timestamp: "Apr 18, 2025",
                    },
                    {
                      action: "Grading Period Closed",
                      details: "Winter Quarter grades finalized",
                      timestamp: "Apr 15, 2025",
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
          </div>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Manage your teaching staff</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {teachers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No teachers available.</p>
                  ) : (
                    teachers.map((teacher, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{teacher.name}</p>
                          <p className="text-sm text-muted-foreground">{teacher.department}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            {teacher.classes} subjects, {teacher.students} students
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link href="/dashboard/admin/teachers">
                  <Button variant="outline" className="w-full">
                    View All Teachers
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Manage your student body</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {students.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No students available.</p>
                  ) : (
                    students.map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.level} - {student.group}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">GPA: {student.gpa}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link href="/dashboard/admin/students">
                  <Button variant="outline" className="w-full">
                    View All Students
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Quick actions for user management</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link href="/dashboard/admin/teachers/new">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Teachers
                </Button>
              </Link>
              <Link href="/dashboard/admin/students/new">
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
              </Link>
              <Link href="/dashboard/admin/classes">
                <Button variant="outline">
                  <School className="mr-2 h-4 w-4" />
                  Manage Subjects
                </Button>
              </Link>
              <Link href="/dashboard/admin/levels">
                <Button variant="outline">
                  <Layers className="mr-2 h-4 w-4" />
                  Manage Levels
                </Button>
              </Link>
              <Link href="/dashboard/admin/groups">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Groups
                </Button>
              </Link>
              <Link href="/dashboard/admin/programs">
                <Button variant="outline">
                  <School className="mr-2 h-4 w-4" />
                  Manage Programs
                </Button>
              </Link>
              <Link href="/dashboard/admin/settings">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "System Maintenance",
                    message: "Scheduled maintenance on April 30, 2025 from 2:00 AM to 4:00 AM.",
                    priority: "High",
                    date: "Apr 20, 2025",
                  },
                  {
                    title: "End of Semester",
                    message: "Spring semester ends on May 15, 2025. All grades must be submitted by May 20.",
                    priority: "Medium",
                    date: "Apr 18, 2025",
                  },
                  {
                    title: "New Curriculum Update",
                    message: "New curriculum guidelines for the 2025-2026 academic year are now available.",
                    priority: "Medium",
                    date: "Apr 15, 2025",
                  },
                  {
                    title: "Staff Meeting",
                    message: "All faculty meeting scheduled for April 25, 2025 at 3:00 PM in the Main Hall.",
                    priority: "Low",
                    date: "Apr 10, 2025",
                  },
                ].map((notification, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                    <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.title}</p>
                        <Badge
                          variant={
                            notification.priority === "High"
                              ? "destructive"
                              : notification.priority === "Medium"
                              ? "default"
                              : "outline"
                          }
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system-wide notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/dashboard/admin/settings/notifications">
                  <Button className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Notification Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}