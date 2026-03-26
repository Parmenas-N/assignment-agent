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
  Award,
  Edit2,
  Save,
  X,
  Moon,
  Sun,
  Bell
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editCourse, setEditCourse] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Load tasks and theme from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    }
    const savedNotifications = localStorage.getItem('notificationsEnabled')
    if (savedNotifications) {
      setNotificationsEnabled(JSON.parse(savedNotifications))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Save notification preference
  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled))
  }, [notificationsEnabled])

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

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDueDate(task.dueDate === 'No deadline' ? '' : task.dueDate)
    setEditCourse(task.course || '')
  }

  const saveEdit = () => {
    if (!editingId) return
    setTasks(
      tasks.map((task) =>
        task.id === editingId
          ? {
              ...task,
              title: editTitle || task.title,
              dueDate: editDueDate || 'No deadline',
              course: editCourse || 'General',
            }
          : task
      )
    )
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
      if (permission === 'granted') {
        alert('🔔 Notifications enabled! You will be reminded of upcoming deadlines.')
      } else {
        alert('❌ Please enable notifications to get deadline reminders.')
      }
    } else {
      alert('Your browser does not support notifications')
    }
  }

  // Check for upcoming deadlines
  const checkDeadlines = () => {
    if (!notificationsEnabled) return
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const upcomingTasks = tasks.filter(task => {
      if (task.completed) return false
      if (task.dueDate === 'No deadline') return false
      
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      
      const isDueToday = dueDate.getTime() === today.getTime()
      const isDueTomorrow = dueDate.getTime() === tomorrow.getTime()
      
      return isDueToday || isDueTomorrow
    })
    
    if (upcomingTasks.length > 0) {
      const dueToday = upcomingTasks.filter(t => new Date(t.dueDate).setHours(0,0,0,0) === today.getTime())
      const dueTomorrow = upcomingTasks.filter(t => new Date(t.dueDate).setHours(0,0,0,0) === tomorrow.getTime())
      
      let message = ''
      if (dueToday.length > 0) {
        message += `📌 ${dueToday.length} assignment${dueToday.length > 1 ? 's' : ''} due TODAY!\n`
      }
      if (dueTomorrow.length > 0) {
        message += `⏰ ${dueTomorrow.length} assignment${dueTomorrow.length > 1 ? 's' : ''} due TOMORROW!`
      }
      
      new Notification('📚 Assignment Reminder', {
        body: message,
        icon: 'https://emojicdn.elk.sh/📚',
        badge: 'https://emojicdn.elk.sh/📚'
      })
    }
  }

  // Check deadlines when tasks change and every hour
  useEffect(() => {
    if (notificationsEnabled) {
      // Check immediately when tasks change
      checkDeadlines()
      // Set up hourly check
      const interval = setInterval(checkDeadlines, 60 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [tasks, notificationsEnabled])

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
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'
    }`}>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-purple-500/20' : 'bg-white/10'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-pink-500/20' : 'bg-yellow-200/10'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 ${
          darkMode ? 'bg-indigo-500/20' : 'bg-purple-300/10'
        }`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-6">
          
          {/* Header with Dark Mode Toggle and Notifications */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <div className={`inline-flex items-center gap-2 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg mb-4 border border-white/30 ${
                darkMode ? 'bg-gray-800/50' : 'bg-white/20'
              }`}>
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">AI-Powered Assignment Tracker</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                Assignment Agent
              </h1>
              <p className="text-white/90">Never miss a deadline again ✨</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={requestNotificationPermission}
                className={`backdrop-blur-sm p-3 rounded-full transition-all ${
                  notificationsEnabled 
                    ? 'bg-green-500/50 text-white hover:bg-green-500/70' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={notificationsEnabled ? 'Notifications enabled ✓' : 'Enable notifications'}
              >
                <Bell size={24} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
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
                
                const isEditing = editingId === task.id
                
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
                        
                        {isEditing ? (
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Course"
                                value={editCourse}
                                onChange={(e) => setEditCourse(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1"
                              >
                                <Save size={16} /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1"
                              >
                                <X size={16} /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
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
                        )}
                      </div>
                      
                      {!isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(task)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
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