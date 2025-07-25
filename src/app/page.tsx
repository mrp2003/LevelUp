import Link from 'next/link';
import { Play, TrendingUp, Calendar, Target, Flame, Award, Clock, Zap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="inline-flex items-center space-x-2 theme-gradient-transparent px-4 py-2 rounded-full border theme-border mb-4">
          <Flame className="h-4 w-4 theme-text" />
          <span className="text-sm text-zinc-300">3 day streak!</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Ready to Level Up?</h1>
        <p className="text-zinc-400 text-lg">Your fitness journey continues today</p>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-xs text-zinc-400">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-sm text-zinc-400">Workouts</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="text-xs text-zinc-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">2.5h</p>
          <p className="text-sm text-zinc-400">This Week</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span className="text-xs text-zinc-400">Goal</span>
          </div>
          <p className="text-2xl font-bold text-white">80%</p>
          <p className="text-sm text-zinc-400">Complete</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span className="text-xs text-zinc-400">Level</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-sm text-zinc-400">Beginner</p>
        </div>
      </section>

      {/* Today's Workout Card */}
      <section className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Today&apos;s Workout</h2>
            <p className="text-zinc-300">Upper Body Strength</p>
          </div>
          <div className="bg-zinc-800/30 p-3 rounded-xl">
            <Zap className="h-6 w-6 theme-text" />
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">45 min</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">8 exercises</span>
          </div>
        </div>

        <Link href="/start-workout" className="block">
          <button className="w-full theme-gradient text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
            <Play className="h-5 w-5" />
            <span>Start Workout</span>
          </button>
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <Link href="/calendar" className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl border border-zinc-700/50 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Schedule</p>
              <p className="text-sm text-zinc-400">Plan workouts</p>
            </div>
          </div>
        </Link>

        <Link href="/workout-history" className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl border border-zinc-700/50 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Progress</p>
              <p className="text-sm text-zinc-400">View stats</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Recent Activity */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-zinc-300">Full Body Workout</span>
            </div>
            <span className="text-sm text-zinc-500">Yesterday</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-zinc-300">Cardio Session</span>
            </div>
            <span className="text-sm text-zinc-500">2 days ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-zinc-300">Leg Day</span>
            </div>
            <span className="text-sm text-zinc-500">3 days ago</span>
          </div>
        </div>
      </section>
    </main>
  );
}
