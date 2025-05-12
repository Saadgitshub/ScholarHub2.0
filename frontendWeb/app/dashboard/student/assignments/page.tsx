"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type Assignment = {
  id: number
  title: string
  description: string
  delay: string
  status: "Not Started" | "In Progress" | "Submitted" | "Graded"
  subjectId: number
  groupId: number
  programId: number
  grade?: string
  submission?: { fileUrl: string }
}

type Subject = {
  id: number
  name: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [studentId] = useState<number>(1) // Hardcoded for testing; replace with auth context

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log(`[DEBUG] Fetching assignments and subjects from ${BACKEND_URL}`);
      const [resAssignments, resSubjects] = await Promise.all([
        fetch(`${BACKEND_URL}/assignments`, { headers: { "Accept": "application/json" } }),
        fetch(`${BACKEND_URL}/subjects`, { headers: { "Accept": "application/json" } }),
      ])

      console.log(`[DEBUG] Assignments fetch status: ${resAssignments.status} ${resAssignments.statusText}`);
      console.log(`[DEBUG] Subjects fetch status: ${resSubjects.status} ${resSubjects.statusText}`);

      if (!resAssignments.ok) {
        const errorText = await resAssignments.text();
        console.error(`[DEBUG] Assignments fetch error response: ${errorText}`);
        throw new Error("Failed to fetch assignments");
      }
      if (!resSubjects.ok) {
        const errorText = await resSubjects.text();
        console.error(`[DEBUG] Subjects fetch error response: ${errorText}`);
        throw new Error("Failed to fetch subjects");
      }

      const assignmentsData = await resAssignments.json()
      const subjectsData = await resSubjects.json()

      console.log(`[DEBUG] Assignments response:`, assignmentsData);
      console.log(`[DEBUG] Subjects response:`, subjectsData);

      setAssignments(Array.isArray(assignmentsData) ? assignmentsData.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        delay: a.delay,
        status: a.status || "Not Started",
        subjectId: a.subjectId || a.subject?.id || 0,
        groupId: a.groupId || a.group?.id || 0,
        programId: a.programId || a.program?.id || 0,
        grade: a.grade,
        submission: a.submission ? { fileUrl: a.submission.fileUrl } : undefined,
      })) : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);

      if (assignmentsData.length === 0) {
        console.log(`[DEBUG] No assignments found`);
        toast({
          title: "No Assignments",
          description: "No assignments available.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching data:`, error);
      setError(error instanceof Error ? error.message : "Failed to load data");
      setAssignments([]);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log(`[DEBUG] Fetch completed, isLoading: false`);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  }

  const getSubjectName = (subjectId: number) => {
    console.log(`[DEBUG] Looking up subjectId: ${subjectId}`);
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  }

  const handleSubmit = async (assignmentId: number) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to submit",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId.toString());
    formData.append("studentId", studentId.toString());
    formData.append("file", selectedFile);

    // Log FormData contents
    console.log(`[DEBUG] Submitting FormData for assignmentId: ${assignmentId}, studentId: ${studentId}`);
    for (const [key, value] of formData.entries()) {
      console.log(`[DEBUG] FormData entry: ${key}=${value instanceof File ? value.name : value}`);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/workreturns`, {
        method: "POST",
        body: formData,
      });

      console.log(`[DEBUG] Submission status: ${res.status} ${res.statusText}`);
      console.log(`[DEBUG] Submission response headers:`, Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const responseText = await res.text();
        let errorMessage = "Failed to submit assignment";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          console.error(`[DEBUG] Submission error response:`, errorData);
        } catch (e) {
          console.error(`[DEBUG] Failed to parse response as JSON:`, e);
          errorMessage = responseText || errorMessage;
          console.error(`[DEBUG] Raw response text:`, responseText);
        }
        throw new Error(errorMessage);
      }

      const savedWorkReturn = await res.json();
      console.log(`[DEBUG] Saved WorkReturn:`, savedWorkReturn);

      // Update assignment status and submission
      setAssignments(assignments.map(a =>
        a.id === assignmentId ? {
          ...a,
          status: "Submitted",
          submission: { fileUrl: savedWorkReturn.fileUrl }
        } : a
      ));

      setSelectedFile(null);
      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });
    } catch (error) {
      console.error(`[DEBUG] Error submitting assignment:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit assignment",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Assignments</h1>
        <p className="text-muted-foreground">View and submit your assignments.</p>
      </div>

      {isLoading && <p>Loading assignments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {assignments.length === 0 && !isLoading && !error ? (
        <p className="text-muted-foreground">No assignments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <CardDescription>{getSubjectName(assignment.subjectId)}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="line-clamp-3">{assignment.description}</p>
                <p className="mt-2">Due: {formatDate(assignment.delay)}</p>
                <p>Status: {assignment.status}</p>
                {assignment.grade && <p>Grade: {assignment.grade}</p>}
                {assignment.submission && (
                  <p>
                    Submission: <a href={assignment.submission.fileUrl} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  </p>
                )}
              </CardContent>
              <CardFooter className="space-x-2">
                {assignment.status !== "Submitted" && assignment.status !== "Graded" && (
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(assignment.id); }}>
                    <div className="space-y-2">
                      <Label htmlFor={`file-${assignment.id}`}>Upload Submission</Label>
                      <Input
                        id={`file-${assignment.id}`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <Button type="submit" className="mt-2">
                      Submit
                    </Button>
                  </form>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}