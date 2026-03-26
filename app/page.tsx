'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  TrendingUp,
  Sparkles,
  Clock,
  BookOpen,
  Award
} from 'lucide-react'

interface Task {
  id: string
  title: string
  dueDate: string
  completed: boolean
  course?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [course, setCourse] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const getPriority = (dueDate: string): 'high' | 'medium' | 'low' => {
    if (!dueDate || dueDate === 'No deadline') return 'medium'
    const today = new Date()
    const due = new Date(dueDate)
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
    if (daysLeft <= 2) return 'high'
    if (daysLeft <= 7) return 'medium'
    return 'low'
  }

  const addTask = () => {
    if (!newTask.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      dueDate: dueDate || 'No deadline',
      completed: false,
      course: course || 'General',
    }

    setTasks([...tasks, task])
    setNewTask('')
    setDueDate('')
    setCourse('')
  }

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => !t.completed && getPriority(t.dueDate) === 'high').length
  }

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)

  return (
    // Beautiful animated gradient background
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-gradient relative">
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg mb-4 border border-white/30">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI-Powered Assignment Tracker</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              Assignment Agent
            </h1>
            <p className="text-white/90">Never miss a deadline again ✨</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.active}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {stats.total > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-purple-600">{completionRate}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}

          {/* Add Task Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-500" />
              Add New Assignment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Course (e.g., Math 101)"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                />
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-md"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'active' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'completed' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No assignments yet</h3>
                <p className="text-gray-600">Add your first assignment above and stay organized!</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const priority = getPriority(task.dueDate)
                const priorityColors = {
                  high: 'border-l-4 border-red-500 bg-red-50',
                  medium: 'border-l-4 border-yellow-500 bg-yellow-50',
                  low: 'border-l-4 border-green-500 bg-green-50'
                }
                
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-xl shadow-md transition-all hover:shadow-lg ${
                      priorityColors[priority]
                    } ${task.completed ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => toggleTask(task.id)} className="hover:scale-110 transition-transform">
                          {task.completed ? (
                            <CheckCircle className="text-green-600" size={24} />
                          ) : (
                            <Circle className="text-gray-400 hover:text-purple-400" size={24} />
                          )}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex gap-3 mt-1">
                            {task.course && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                📚 {task.course}
                              </span>
                            )}
                            <span className="text-xs flex items-center gap-1 text-gray-500">
                              <Calendar size={12} />
                              Due: {task.dueDate}
                            </span>
                            {!task.completed && priority === 'high' && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full animate-pulse">
                                🔥 Urgent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Motivational Quote */}
          {stats.completed === stats.total && stats.total > 0 && (
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <p className="text-lg font-semibold text-green-800">🎉 Amazing work! All caught up! 🎉</p>
                <p className="text-green-600 mt-1">You're crushing your goals!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}