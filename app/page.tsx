'use client'

import Link from 'next/link'
import { 
  Sparkles, 
  Calendar, 
  Bell, 
  Edit3, 
  Moon, 
  Download, 
  Star, 
  TrendingUp,
  ArrowRight,
  Quote,
  Mail
} from 'lucide-react'

export default function Home() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "Assignment Agent saved my semester! I never miss deadlines anymore. The AI features are incredible!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Engineering Student",
      content: "The best task manager I've ever used. The dark mode and notifications keep me on track 24/7.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Medical Student",
      content: "With so many assignments, this app is a lifesaver. Love the priority colors and progress tracking!",
      rating: 5,
      avatar: "ER"
    }
  ]

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Deadlines",
      description: "Set due dates and get automatic priority colors - red for urgent, yellow for soon, green for later"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Browser Notifications",
      description: "Get reminded before deadlines with friendly pop-up notifications"
    },
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "Easy Editing",
      description: "Edit assignments, courses, and due dates anytime with one click"
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: "Dark Mode",
      description: "Study late at night? Toggle dark mode for comfortable viewing"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Watch your progress with visual stats and completion percentage"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export Calendar",
      description: "Sync with Google Calendar or Apple Calendar (coming soon)"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">Assignment Agent</span>
            </div>
            <Link 
              href="/dashboard"
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
            >
              Launch App →
            </Link>
          </nav>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI-Powered Assignment Tracker</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Never Miss Another<br />
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Deadline Again
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your intelligent assignment manager that helps you stay organized, track progress, 
              and get notified before deadlines. Used by students worldwide!
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-white/80 text-lg">Everything you need to stay on top of your assignments</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group"
            >
              <div className="text-white mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/10 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/70">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-white/70">Tasks Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-white/70">On-Time Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">What Students Say</h2>
          <p className="text-white/80 text-lg">Join thousands of satisfied students</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-white/30 mb-4" />
              <p className="text-white/90 mb-4 italic">"{review.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{review.name}</p>
                  <p className="text-white/60 text-sm">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Organized?</h2>
          <p className="text-white/90 mb-8">Join thousands of students already using Assignment Agent</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all"
          >
            Start Managing Your Assignments
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Assignment Agent</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors">About</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-xl">
                🐙
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-xl">
                🐦
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center text-white/50 text-sm mt-8">
            © 2026 Assignment Agent. Created by Parmenas Njoroge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}