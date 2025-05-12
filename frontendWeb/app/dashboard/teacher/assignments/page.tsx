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

type Assignment = {
  id: number
  title: string
  description: string
  delay: string // ISO string from LocalDateTime
  status: "Not Started" | "In Progress" | "Submitted" | "Graded"
  subjectId: number
  groupId: number
  programId: number
}

type Subject = {
  id: number
  name: string
}

type Group = {
  id: number
  name: string
}

type Program = {
  id: number
  name: string
}

const BACKEND_URL = "http://localhost:8080/api"

export default function AddAssignmentForm() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newAssignment, setNewAssignment] = useState<Assignment>({
    id: 0,
    title: "",
    description: "",
    delay: "",
    status: "Not Started",
    subjectId: 0,
    groupId: 0,
    programId: 0,
  })

  // Fetch subjects, groups, programs, and assignments
  const fetchFormData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log(`[DEBUG] Fetching form data from ${BACKEND_URL}`);
      const [resSubjects, resGroups, resPrograms, resAssignments] = await Promise.all([
        fetch(`${BACKEND_URL}/subjects`, { headers: { "Accept": "application/json" } }),
        fetch(`${BACKEND_URL}/groups`, { headers: { "Accept": "application/json" } }),
        fetch(`${BACKEND_URL}/programs`, { headers: { "Accept": "application/json" } }),
        fetch(`${BACKEND_URL}/assignments/all`, { headers: { "Accept": "application/json" } }),
      ])

      console.log(`[DEBUG] Subjects fetch status: ${resSubjects.status} ${resSubjects.statusText}`);
      console.log(`[DEBUG] Groups fetch status: ${resGroups.status} ${resGroups.statusText}`);
      console.log(`[DEBUG] Programs fetch status: ${resPrograms.status} ${resPrograms.statusText}`);
      console.log(`[DEBUG] Assignments fetch status: ${resAssignments.status} ${resAssignments.statusText}`);

      if (!resSubjects.ok) {
        const errorText = await resSubjects.text();
        console.error(`[DEBUG] Subjects fetch error response: ${errorText}`);
        throw new Error("Failed to fetch subjects");
      }
      if (!resGroups.ok) {
        const errorText = await resGroups.text();
        console.error(`[DEBUG] Groups fetch error response: ${errorText}`);
        throw new Error("Failed to fetch groups");
      }
      if (!resPrograms.ok) {
        const errorText = await resPrograms.text();
        console.error(`[DEBUG] Programs fetch error response: ${errorText}`);
        throw new Error("Failed to fetch programs");
      }
      if (!resAssignments.ok) {
        const errorText = await resAssignments.text();
        console.error(`[DEBUG] Assignments fetch error response: ${errorText}`);
        throw new Error("Failed to fetch assignments");
      }

      const subjectsData = await resSubjects.json()
      const groupsData = await resGroups.json()
      const programsData = await resPrograms.json()
      const assignmentsData = await resAssignments.json()

      console.log(`[DEBUG] Subjects response:`, subjectsData);
      console.log(`[DEBUG] Groups response:`, groupsData);
      console.log(`[DEBUG] Programs response:`, programsData);
      console.log(`[DEBUG] Assignments response:`, assignmentsData);

      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setGroups(Array.isArray(groupsData) ? groupsData : []);
      setPrograms(Array.isArray(programsData) ? programsData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        delay: a.delay,
        status: a.status || "Not Started",
        subjectId: a.subjectId || a.subject?.id || 0,
        groupId: a.groupId || a.group?.id || 0,
        programId: a.programId || a.program?.id || 0,
      })) : []);

      if (assignmentsData.length === 0) {
        console.log(`[DEBUG] No assignments found`);
        toast({
          title: "No Assignments",
          description: "No existing assignments found.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(`[DEBUG] Error fetching form data:`, error);
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
    fetchFormData();
  }, [])

  // Format LocalDateTime (e.g., "2025-12-01T00:00:00") to readable date
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

  const getGroupName = (groupId: number) => {
    console.log(`[DEBUG] Looking up groupId: ${groupId}`);
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : "Unknown Group";
  }

  const getProgramName = (programId: number) => {
    console.log(`[DEBUG] Looking up programId: ${programId}`);
    const program = programs.find(p => p.id === programId);
    return program ? program.name : "Unknown Program";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate IDs
    if (newAssignment.subjectId === 0 || newAssignment.groupId === 0 || newAssignment.programId === 0) {
      toast({
        title: "Error",
        description: "Please select a valid subject, group, and program",
        variant: "destructive",
      });
      return;
    }

    const formattedDelay = newAssignment.delay ? `${newAssignment.delay}T00:00:00` : '';

    const assignmentToSend = {
      id: newAssignment.id,
      title: newAssignment.title,
      description: newAssignment.description,
      delay: formattedDelay,
      status: newAssignment.status,
      subjectId: newAssignment.subjectId,
      groupId: newAssignment.groupId,
      programId: newAssignment.programId,
    };

    try {
      console.log(`[DEBUG] Submitting assignment:`, assignmentToSend);
      const res = await fetch(`${BACKEND_URL}/assignments${newAssignment.id ? `/${newAssignment.id}` : ''}`, {
        method: newAssignment.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(assignmentToSend),
      });

      console.log(`[DEBUG] Assignment submission status: ${res.status} ${res.statusText}`);
      if (!res.ok) {
        const responseText = await res.text();
        let errorMessage = `Failed to ${newAssignment.id ? "update" : "create"} assignment`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error(`[DEBUG] Assignment submission error response:`, errorData);
        } catch {
          console.error(`[DEBUG] Failed to parse error response as JSON:`, responseText);
          errorMessage = `${errorMessage}: ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      const savedAssignment = await res.json();
      console.log(`[DEBUG] Saved assignment:`, savedAssignment);

      // Normalize response
      const updatedAssignment = {
        id: savedAssignment.id,
        title: savedAssignment.title,
        description: savedAssignment.description,
        delay: savedAssignment.delay,
        status: savedAssignment.status || "Not Started",
        subjectId: savedAssignment.subjectId || 0,
        groupId: savedAssignment.groupId || 0,
        programId: savedAssignment.programId || 0,
      };
      console.log(`[DEBUG] Normalized assignment:`, updatedAssignment);

      if (newAssignment.id) {
        setAssignments(assignments.map(assignment =>
          assignment.id === savedAssignment.id ? updatedAssignment : assignment
        ));
      } else {
        setAssignments([...assignments, updatedAssignment]);
      }

      setNewAssignment({
        id: 0,
        title: "",
        description: "",
        delay: "",
        status: "Not Started",
        subjectId: 0,
        groupId: 0,
        programId: 0,
      });

      toast({
        title: "Success",
        description: newAssignment.id ? "Assignment updated successfully!" : "Assignment created successfully!",
      });
    } catch (error) {
      console.error(`[DEBUG] Error submitting assignment:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${newAssignment.id ? "update" : "create"} assignment`,
        variant: "destructive",
      });
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setNewAssignment({
      ...assignment,
      delay: assignment.delay.split('T')[0], // Convert to YYYY-MM-DD for input
    });
  }

  const handleDelete = async (id: number) => {
    try {
      console.log(`[DEBUG] Deleting assignment id: ${id}`);
      const res = await fetch(`${BACKEND_URL}/assignments/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
      });

      console.log(`[DEBUG] Delete assignment status: ${res.status} ${res.statusText}`);
      if (!res.ok) {
        const responseText = await res.text();
        let errorMessage = "Failed to delete assignment";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error(`[DEBUG] Delete assignment error response:`, errorData);
        } catch {
          console.error(`[DEBUG] Failed to parse delete error response as JSON:`, responseText);
          errorMessage = `${errorMessage}: ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      setAssignments(assignments.filter(assignment => assignment.id !== id));
      toast({
        title: "Success",
        description: "Assignment deleted successfully!",
      });
    } catch (error) {
      console.error(`[DEBUG] Error deleting assignment:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete assignment",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6" style={{ padding: "20px" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Assignments</h1>
        <p className="text-muted-foreground">Create, edit, or delete assignments for your students.</p>
      </div>

      {isLoading && <p>Loading assignments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>{newAssignment.id ? "Edit Assignment" : "Create Assignment"}</CardTitle>
          <CardDescription>Fill in the details to {newAssignment.id ? "update" : "create"} an assignment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter assignment title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter assignment description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delay">Due Date</Label>
              <Input
                id="delay"
                type="date"
                value={newAssignment.delay}
                onChange={(e) => setNewAssignment({ ...newAssignment, delay: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectId">Subject</Label>
              <select
                id="subjectId"
                value={newAssignment.subjectId}
                onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: parseInt(e.target.value) })}
                required
                className="w-full border rounded-md p-2"
              >
                <option value={0} disabled>Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupId">Group</Label>
              <select
                id="groupId"
                value={newAssignment.groupId}
                onChange={(e) => setNewAssignment({ ...newAssignment, groupId: parseInt(e.target.value) })}
                required
                className="w-full border rounded-md p-2"
              >
                <option value={0} disabled>Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="programId">Program</Label>
              <select
                id="programId"
                value={newAssignment.programId}
                onChange={(e) => setNewAssignment({ ...newAssignment, programId: parseInt(e.target.value) })}
                required
                className="w-full border rounded-md p-2"
              >
                <option value={0} disabled>Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>
            <div className="space-x-2">
              <Button type="submit">{newAssignment.id ? "Update Assignment" : "Create Assignment"}</Button>
              {newAssignment.id !== 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewAssignment({
                    id: 0,
                    title: "",
                    description: "",
                    delay: "",
                    status: "Not Started",
                    subjectId: 0,
                    groupId: 0,
                    programId: 0,
                  })}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

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
                <p>Group: {getGroupName(assignment.groupId)}</p>
                <p>Program: {getProgramName(assignment.programId)}</p>
                <p>Status: {assignment.status}</p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button onClick={() => handleEdit(assignment)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the assignment "{assignment.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(assignment.id)}>
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