'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
  Award,
  LogOut,
  Mail,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react'

interface Task {
  id: string
  title: string
  due_date: string
  completed: boolean
  course?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [course, setCourse] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchTasks(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchTasks(session.user.id)
      } else {
        setTasks([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch tasks from Supabase
  const fetchTasks = async (userId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
  }

  // Handle authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        alert(error.message)
      } else {
        alert('Check your email for confirmation! ✉️')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      }
    }
    setAuthLoading(false)
  }

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // Add task to Supabase
  const addTask = async () => {
    if (!newTask.trim() || !user) return

    const task = {
      user_id: user.id,
      title: newTask,
      due_date: dueDate || 'No deadline',
      course: course || 'General',
      completed: false,
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()

    if (error) {
      console.error('Error adding task:', error)
      alert('Failed to add task')
    } else if (data) {
      setTasks([data[0], ...tasks])
      setNewTask('')
      setDueDate('')
      setCourse('')
    }
  }

  // Toggle task completion
  const toggleTask = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !completed } : task
      ))
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
    } else {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const getPriority = (dueDate: string): 'high' | 'medium' | 'low' => {
    if (!dueDate || dueDate === 'No deadline') return 'medium'
    const today = new Date()
    const due = new Date(dueDate)
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
    if (daysLeft <= 2) return 'high'
    if (daysLeft <= 7) return 'medium'
    return 'low'
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
    highPriority: tasks.filter(t => !t.completed && getPriority(t.due_date) === 'high').length
  }

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  // Show auth form if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
        <div className="relative">
          {/* Animated background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-full mb-4 shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Assignment Agent</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-white/70">
                {isSignUp 
                  ? 'Start managing your assignments today' 
                  : 'Sign in to continue your journey'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/50"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
              >
                {authLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In →' 
                  : "Don't have an account? Create one →"}
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
              <div className="w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show main dashboard when logged in
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-6">
          
          {/* Header with Sign Out */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">AI-Powered Assignment Tracker</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Assignment Agent
              </h1>
              <p className="text-gray-200">Never miss a deadline again ✨</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <BookOpen className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.active}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Urgent</p>
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
                <span className="text-sm font-semibold text-indigo-600">{completionRate}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}

          {/* Add Task Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" />
              Add New Assignment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Course (e.g., Math 101)"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                />
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-md"
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
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'active' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'completed' 
                  ? 'bg-indigo-600 text-white shadow-md' 
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
                const priority = getPriority(task.due_date)
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
                        <button onClick={() => toggleTask(task.id, task.completed)} className="hover:scale-110 transition-transform">
                          {task.completed ? (
                            <CheckCircle className="text-green-600" size={24} />
                          ) : (
                            <Circle className="text-gray-400 hover:text-indigo-400" size={24} />
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
                              Due: {task.due_date}
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