import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Heart, Brain, Palette, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { statsStorage } from "@/lib/storage";

/**
 * Home Page - Dashboard
 * Design: Modern Wellness with Arabic Heritage
 * - Mesh gradient hero section
 * - 4 module cards representing personal development pillars
 * - Real progress tracking from localStorage
 */

export default function Home() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState(statsStorage.getStats());

  useEffect(() => {
    // Update stats on mount
    setStats(statsStorage.getStats());
  }, []);

  const modules = [
    {
      id: "mental-health",
      title: "Mental Health",
      description: "Track your mood, journal your thoughts, and practice breathing exercises",
      icon: Heart,
      color: "from-teal-400 to-cyan-500",
      path: "/mental-health",
      accent: "bg-teal-50 text-teal-700",
      count: stats.totalMoodEntries,
    },
    {
      id: "logical-thinking",
      title: "Logical Thinking",
      description: "Master pseudocode and solve logic puzzles to strengthen your reasoning",
      icon: Brain,
      color: "from-purple-400 to-violet-500",
      path: "/logical-thinking",
      accent: "bg-purple-50 text-purple-700",
      count: stats.logicalChallengesCompleted,
    },
    {
      id: "creativity",
      title: "Creativity",
      description: "Daily creative challenges: draw, write stories, and get AI feedback",
      icon: Palette,
      color: "from-amber-400 to-orange-500",
      path: "/creativity",
      accent: "bg-amber-50 text-amber-700",
      count: stats.creativeSubmissions,
    },
    {
      id: "mathematical-thinking",
      title: "Mathematical Thinking",
      description: "Speed calculation training with progressive difficulty levels",
      icon: Calculator,
      color: "from-slate-600 to-blue-600",
      path: "/mathematical-thinking",
      accent: "bg-slate-50 text-slate-700",
      count: stats.mathChallengesCompleted,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header with Logo */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Basma</h1>
              <p className="text-xs text-slate-500">Personal Growth Journey</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">نحو مجتمع أكثر وعياً</p>
            <p className="text-xs text-slate-500">Towards a conscious society</p>
          </div>
        </div>
      </header>

      {/* Hero Section with Mesh Gradient */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" />
              </filter>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="1200" height="600" fill="#F8FAFC" />
            <circle cx="200" cy="100" r="300" fill="url(#grad1)" filter="url(#noise)" />
            <circle cx="1000" cy="500" r="350" fill="url(#grad2)" filter="url(#noise)" />
            <circle cx="600" cy="300" r="250" fill="#F59E0B" opacity="0.1" filter="url(#noise)" />
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Welcome to Your Growth Journey
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Develop your mental health, logical thinking, creativity, and mathematical skills through daily challenges and mindful practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                onClick={() => navigate("/mental-health")}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="container py-16 md:py-24">
        <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Four Pillars of Growth
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(module.path)}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl ${module.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">
                    {module.title}
                  </h4>
                  <p className="text-slate-600 mb-6 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Progress Counter */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      <span className="font-bold text-slate-900">{module.count}</span> activities completed
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all duration-300">
                    Explore
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* User Stats Section */}
      {stats.totalMoodEntries > 0 && (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="container">
            <h3 className="text-3xl font-bold mb-12 text-center">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">{stats.totalMoodEntries}</p>
                <p className="text-slate-300">Mood Entries</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{stats.totalJournalEntries}</p>
                <p className="text-slate-300">Journal Entries</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{stats.logicalChallengesCompleted}</p>
                <p className="text-slate-300">Logic Challenges</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{stats.currentStreak}</p>
                <p className="text-slate-300">Day Streak</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container text-center text-slate-600 text-sm">
          <p>© 2026 Basma - Personal Growth Platform</p>
          <p className="mt-2">نحو مجتمع أكثر وعياً - Towards a more conscious society</p>
        </div>
      </footer>
    </div>
  );
}
