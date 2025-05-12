"use client"

import { useEffect, useState } from 'react'

type Student = {
  id: number
  email: string
  password: string
  firstname: string
  lastname: string
  group: {
    id: number
    name: string
  }
  level: {
    id: number
    name: string
  }
}

export default function StudentProfile() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editMode, setEditMode] = useState(false)

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // In production, get ID from auth/session
        const studentId = 1 // Replace with actual logged-in student ID
        const response = await fetch(`http://localhost:8080/api/students/${studentId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setStudent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!student) return
    
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!student) return

    try {
      setError('')
      setSuccess('')
      setLoading(true)

      const response = await fetch(`http://localhost:8080/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: student.email,
          password: student.password,
          firstname: student.firstname,
          lastname: student.lastname,
          // Keep existing groupId and levelId
          groupId: student.group.id,
          levelId: student.level.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const updatedStudent = await response.json()
      setStudent(updatedStudent)
      setSuccess('Profile updated successfully!')
      setEditMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
        <div className="text-red-500">{error || 'No student data found'}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {!editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg">{student.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">First Name</label>
            <p className="mt-1 text-lg">{student.firstname}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Name</label>
            <p className="mt-1 text-lg">{student.lastname}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Group</label>
            <p className="mt-1 text-lg">{student.group.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Level</label>
            <p className="mt-1 text-lg">{student.level.name}</p>
          </div>
          
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={student.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstname"
              value={student.firstname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={student.lastname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <label className="block text-sm font-medium text-gray-700">Group</label>
            <p className="mt-1">{student.group.name}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <p className="mt-1">{student.level.name}</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}