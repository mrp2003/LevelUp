import React from 'react';
import { Calendar, Clock, Flame, TrendingUp, Filter, Search, ChevronDown } from 'lucide-react';

export default function WorkoutHistoryPage() {
  const workouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      date: '2025-01-18',
      duration: 45,
      calories: 320,
      exercises: 8,
      type: 'Strength',
      intensity: 'High',
      notes: 'Great session, felt strong on bench press'
    },
    {
      id: 2,
      name: 'Morning Cardio',
      date: '2025-01-17',
      duration: 30,
      calories: 280,
      exercises: 6,
      type: 'Cardio',
      intensity: 'Medium',
      notes: 'Good pace, steady heart rate'
    },
    {
      id: 3,
      name: 'Leg Day Destroyer',
      date: '2025-01-16',
      duration: 60,
      calories: 420,
      exercises: 10,
      type: 'Strength',
      intensity: 'High',
      notes: 'Tough workout, legs are sore!'
    },
    {
      id: 4,
      name: 'HIIT Blast',
      date: '2025-01-15',
      duration: 25,
      calories: 250,
      exercises: 8,
      type: 'HIIT',
      intensity: 'High',
      notes: 'Quick but intense, great sweat'
    },
    {
      id: 5,
      name: 'Full Body Flow',
      date: '2025-01-14',
      duration: 50,
      calories: 380,
      exercises: 12,
      type: 'Strength',
      intensity: 'Medium',
      notes: 'Balanced workout, good form focus'
    }
  ];

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Strength': return 'bg-blue-500/20 text-blue-400';
      case 'Cardio': return 'bg-red-500/20 text-red-400';
      case 'HIIT': return 'bg-orange-500/20 text-orange-400';
      case 'Flexibility': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Detailed History</h1>
          <p className="text-slate-400">Complete workout logs and details</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
          <Calendar className="h-6 w-6 text-white" />
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search workouts..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl border border-slate-600 text-slate-300 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Monthly Stats */}
      <section className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">18</p>
          <p className="text-sm text-slate-400">This Month</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">15.2h</p>
          <p className="text-sm text-slate-400">Total Time</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">5,840</p>
          <p className="text-sm text-slate-400">Calories</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">92%</p>
          <p className="text-sm text-slate-400">Consistency</p>
        </div>
      </section>

      {/* Workout List */}
      <section className="space-y-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors cursor-pointer">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{workout.name}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(workout.type)}`}>
                    {workout.type}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getIntensityColor(workout.intensity)}`}>
                    {workout.intensity}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  {new Date(workout.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{workout.duration} min</p>
                  <p className="text-slate-400 text-xs">Duration</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{workout.calories} cal</p>
                  <p className="text-slate-400 text-xs">Burned</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{workout.exercises}</p>
                  <p className="text-slate-400 text-xs">Exercises</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {workout.notes && (
              <div className="bg-slate-700/50 p-3 rounded-xl">
                <p className="text-slate-300 text-sm italic">"{workout.notes}"</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 mt-4">
              <button className="text-slate-400 hover:text-white text-sm transition-colors">
                View Details
              </button>
              <button className="text-slate-400 hover:text-white text-sm transition-colors">
                Repeat Workout
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Load More */}
      <section className="text-center">
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl border border-slate-700/50 transition-colors">
          Load More Workouts
        </button>
      </section>
    </main>
  );
}
