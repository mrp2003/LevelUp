import React from 'react';
import { TrendingUp, Calendar, Clock, Flame, Award, Target, ChevronRight, BarChart3 } from 'lucide-react';

export default function HistoryPage() {
  const workoutHistory = [
    {
      id: 1,
      date: 'Today',
      type: 'Upper Body Strength',
      duration: '45 min',
      exercises: 8,
      calories: 320,
      completed: true,
      intensity: 'High'
    },
    {
      id: 2,
      date: 'Yesterday',
      type: 'Cardio HIIT',
      duration: '30 min',
      exercises: 6,
      calories: 280,
      completed: true,
      intensity: 'High'
    },
    {
      id: 3,
      date: '2 days ago',
      type: 'Lower Body',
      duration: '50 min',
      exercises: 10,
      calories: 380,
      completed: true,
      intensity: 'Medium'
    },
    {
      id: 4,
      date: '3 days ago',
      type: 'Full Body',
      duration: '60 min',
      exercises: 12,
      calories: 420,
      completed: true,
      intensity: 'High'
    },
  ];

  const weeklyStats = [
    { day: 'Mon', workouts: 1, duration: 45 },
    { day: 'Tue', workouts: 1, duration: 30 },
    { day: 'Wed', workouts: 0, duration: 0 },
    { day: 'Thu', workouts: 1, duration: 50 },
    { day: 'Fri', workouts: 1, duration: 60 },
    { day: 'Sat', workouts: 0, duration: 0 },
    { day: 'Sun', workouts: 1, duration: 40 },
  ];

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Workout History</h1>
          <p className="text-slate-400">Track your fitness progress</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
      </section>

      {/* Weekly Overview Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-xs text-slate-400">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">1,420</p>
          <p className="text-sm text-slate-400">Calories Burned</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="text-xs text-slate-400">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-white">4.2h</p>
          <p className="text-sm text-slate-400">This Week</p>
        </div>
      </section>

      {/* Weekly Activity Chart */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
          <TrendingUp className="h-5 w-5 text-green-400" />
        </div>
        
        <div className="flex items-end justify-between h-32 mb-4">
          {weeklyStats.map((stat, index) => (
            <div key={stat.day} className="flex flex-col items-center space-y-2">
              <div className="flex flex-col items-center space-y-1">
                <div 
                  className={`w-6 rounded-t-lg transition-all duration-500 ${
                    stat.workouts > 0 
                      ? 'bg-gradient-to-t from-indigo-500 to-purple-600' 
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${Math.max(stat.duration * 1.5, 8)}px` }}
                ></div>
                {stat.workouts > 0 && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs text-slate-400">{stat.day}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded"></div>
            <span className="text-slate-400">Workout Duration</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-slate-400">Completed</span>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Recent Achievement</h3>
            <p className="text-yellow-100">Keep up the great work!</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Award className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">5-Day Streak!</p>
              <p className="text-yellow-100 text-sm">Completed 5 workouts in a row</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workout History List */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Workouts</h3>
        
        <div className="space-y-3">
          {workoutHistory.map((workout) => (
            <div key={workout.id} className="bg-slate-700/50 p-4 rounded-xl hover:bg-slate-700/70 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    workout.intensity === 'High' ? 'bg-red-400' :
                    workout.intensity === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{workout.type}</p>
                    <p className="text-slate-400 text-sm">{workout.date}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{workout.duration}</span>
                  </span>
                  <span>{workout.exercises} exercises</span>
                  <span className="flex items-center space-x-1">
                    <Flame className="h-3 w-3" />
                    <span>{workout.calories} cal</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Summary */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">January Summary</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">18</p>
            <p className="text-sm text-slate-400">Total Workouts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">15.2h</p>
            <p className="text-sm text-slate-400">Total Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">5,840</p>
            <p className="text-sm text-slate-400">Calories Burned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">92%</p>
            <p className="text-sm text-slate-400">Goal Achievement</p>
          </div>
        </div>
      </section>
    </main>
  );
} 