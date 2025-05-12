"use client"

import { useEffect, useState } from 'react'

type Teacher = {
  id: number
  email: string
  password: string
  firstname: string
  lastname: string
}

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editMode, setEditMode] = useState(false)

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // In production, get ID from auth/session
        const teacherId = 1 // Replace with actual logged-in teacher ID
        const response = await fetch(`http://localhost:8080/api/teachers/${teacherId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setTeacher(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchTeacher()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!teacher) return
    
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacher) return

    try {
      setError('')
      setSuccess('')
      setLoading(true)

      const response = await fetch(`http://localhost:8080/api/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: teacher.email,
          password: teacher.password,
          firstname: teacher.firstname,
          lastname: teacher.lastname
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const updatedTeacher = await response.json()
      setTeacher(updatedTeacher)
      setSuccess('Profile updated successfully!')
      setEditMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !teacher) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Teacher Profile</h1>
        <div className="text-red-500">{error || 'No teacher data found'}</div>
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
      <h1 className="text-2xl font-bold mb-6">Teacher Profile</h1>
      
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
            <p className="mt-1 text-lg">{teacher.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">First Name</label>
            <p className="mt-1 text-lg">{teacher.firstname}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Name</label>
            <p className="mt-1 text-lg">{teacher.lastname}</p>
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
              value={teacher.email}
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
              value={teacher.password}
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
              value={teacher.firstname}
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
              value={teacher.lastname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
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