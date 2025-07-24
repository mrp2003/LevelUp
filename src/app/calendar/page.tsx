import { ChevronLeft, ChevronRight, Plus, CheckCircle, Clock, Zap } from 'lucide-react';

export default function CalendarPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  // Mock workout data
  const workouts: { [key: number]: { type: string; completed: boolean } } = {
    15: { type: 'Upper Body', completed: true },
    16: { type: 'Cardio', completed: true },
    17: { type: 'Rest Day', completed: false },
    18: { type: 'Lower Body', completed: false },
    19: { type: 'HIIT', completed: false },
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Workout Calendar</h1>
          <p className="text-zinc-400">Plan and track your fitness journey</p>
        </div>
      </section>

      {/* Month Navigation */}
      <section className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5 text-zinc-400" />
          </button>
          <h2 className="text-xl font-semibold text-white">January 2025</h2>
          <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center py-2">
              <span className="text-sm font-medium text-zinc-400">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for month start */}
          {Array.from({ length: 2 }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}

          {/* Date cells */}
          {dates.slice(0, 29).map((date) => {
            const workout = workouts[date];
            const isToday = date === 18;

            return (
              <div
                key={date}
                className={`aspect-square p-1 rounded-xl border transition-all duration-200 cursor-pointer relative ${isToday
                  ? 'bg-gradient-to-r from-orange-500/20 to-pink-600/20 border-orange-400 text-white'
                  : workout
                    ? workout.completed
                      ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30'
                      : 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30'
                    : 'border-zinc-700/50 hover:bg-zinc-700/50'
                  }`}
              >
                {workout && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {workout.completed ? (
                      <CheckCircle className="h-8 w-8 text-green-400/10" />
                    ) : (
                      <Clock className="h-8 w-8 text-blue-400/10" />
                    )}
                  </div>
                )}
                <div className="h-full flex flex-col items-center justify-center relative z-10">
                  <span className={`text-sm font-medium ${isToday ? 'text-white' : 'text-zinc-300'}`}>
                    {date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Today's Schedule */}
      <section className="bg-gradient-to-r from-orange-600/20 to-pink-600/20 p-6 rounded-2xl border border-orange-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Today&apos;s Plan</h3>
            <p className="text-zinc-300">January 18, 2025</p>
          </div>
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-orange-400" />
          </div>
        </div>

        <div className="bg-zinc-800/30 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Lower Body Strength</span>
            <span className="text-zinc-300 text-sm">6:00 PM</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-400 text-sm">
            <span>45 minutes</span>
            <span>•</span>
            <span>6 exercises</span>
            <span>•</span>
            <span>Intermediate</span>
          </div>
        </div>
      </section>

      {/* Weekly Overview */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">This Week&apos;s Progress</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Upper Body</p>
                <p className="text-zinc-400 text-sm">Monday - Completed</p>
              </div>
            </div>
            <span className="text-green-400 text-sm">✓</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Cardio Session</p>
                <p className="text-zinc-400 text-sm">Tuesday - Completed</p>
              </div>
            </div>
            <span className="text-green-400 text-sm">✓</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Lower Body</p>
                <p className="text-zinc-400 text-sm">Today - Scheduled</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm">6:00 PM</span>
          </div>
        </div>
      </section>

      {/* Add Workout Button */}
      <button className="fixed bottom-24 right-4 bg-gradient-to-r from-orange-500/20 to-pink-600/20 border border-orange-500/30 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
        <Plus className="h-6 w-6 text-orange-400" />
      </button>
    </main>
  );
} 