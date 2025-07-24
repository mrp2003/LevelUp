"use client";

import React, { useState } from 'react';
import { Plus, X, Clock, Target, Zap, Save, Dumbbell, Heart, Flame } from 'lucide-react';

export default function NewWorkoutPage() {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [exercises, setExercises] = useState([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    duration: '',
    rest: '60'
  });

  const workoutTypes = [
    { id: 'strength', name: 'Strength Training', icon: Dumbbell, color: 'from-blue-500 to-blue-600' },
    { id: 'cardio', name: 'Cardio', icon: Heart, color: 'from-red-500 to-red-600' },
    { id: 'hiit', name: 'HIIT', icon: Flame, color: 'from-orange-500 to-orange-600' },
    { id: 'flexibility', name: 'Flexibility', icon: Target, color: 'from-green-500 to-green-600' },
  ];

  const popularExercises = [
    'Push-ups', 'Squats', 'Lunges', 'Plank', 'Burpees', 'Pull-ups',
    'Deadlifts', 'Bench Press', 'Shoulder Press', 'Bicep Curls',
    'Tricep Dips', 'Mountain Climbers', 'Jumping Jacks', 'Russian Twists'
  ];

  const addExercise = () => {
    if (newExercise.name) {
      setExercises([...exercises, { ...newExercise, id: Date.now() }]);
      setNewExercise({ name: '', sets: '', reps: '', duration: '', rest: '60' });
      setShowExerciseForm(false);
    }
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = () => {
    // Here you would typically save to a database or state management
    console.log('Saving workout:', { workoutName, workoutType, exercises });
    alert('Workout saved successfully!');
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Create Workout</h1>
          <p className="text-slate-400">Design your perfect training session</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
          <Plus className="h-6 w-6 text-white" />
        </div>
      </section>

      {/* Workout Details */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Workout Details</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Workout Name</label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Upper Body Strength"
            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Workout Type</label>
          <div className="grid grid-cols-2 gap-3">
            {workoutTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setWorkoutType(type.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    workoutType === type.id
                      ? `bg-gradient-to-r ${type.color} border-transparent text-white`
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{type.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exercises List */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Exercises ({exercises.length})</h3>
          <button
            onClick={() => setShowExerciseForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Exercise</span>
          </button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No exercises added yet</p>
            <p className="text-slate-500 text-sm">Click "Add Exercise" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="bg-slate-700/50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-500 text-white text-sm font-medium px-2 py-1 rounded-lg">
                      {index + 1}
                    </span>
                    <h4 className="text-white font-medium">{exercise.name}</h4>
                  </div>
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="p-1 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  {exercise.sets && <span>{exercise.sets} sets</span>}
                  {exercise.reps && <span>{exercise.reps} reps</span>}
                  {exercise.duration && <span>{exercise.duration}s duration</span>}
                  {exercise.rest && <span>{exercise.rest}s rest</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Exercise Form */}
      {showExerciseForm && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Add Exercise</h3>
            <button
              onClick={() => setShowExerciseForm(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-2">Exercise Name</label>
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                placeholder="Enter exercise name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              
              {/* Popular Exercises */}
              <div className="mt-2">
                <p className="text-xs text-indigo-200 mb-2">Popular exercises:</p>
                <div className="flex flex-wrap gap-2">
                  {popularExercises.slice(0, 6).map((exercise) => (
                    <button
                      key={exercise}
                      onClick={() => setNewExercise({...newExercise, name: exercise})}
                      className="text-xs bg-white/20 text-white px-2 py-1 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {exercise}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-100 mb-2">Sets</label>
                <input
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                  placeholder="3"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-100 mb-2">Reps</label>
                <input
                  type="text"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                  placeholder="12-15"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-100 mb-2">Duration (seconds)</label>
                <input
                  type="number"
                  value={newExercise.duration}
                  onChange={(e) => setNewExercise({...newExercise, duration: e.target.value})}
                  placeholder="45"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-100 mb-2">Rest (seconds)</label>
                <input
                  type="number"
                  value={newExercise.rest}
                  onChange={(e) => setNewExercise({...newExercise, rest: e.target.value})}
                  placeholder="60"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            <button
              onClick={addExercise}
              className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Add Exercise
            </button>
          </div>
        </section>
      )}

      {/* Workout Summary */}
      {exercises.length > 0 && (
        <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Workout Summary</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-indigo-500/20 p-3 rounded-xl mb-2">
                <Target className="h-6 w-6 text-indigo-400 mx-auto" />
              </div>
              <p className="text-2xl font-bold text-white">{exercises.length}</p>
              <p className="text-sm text-slate-400">Exercises</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-xl mb-2">
                <Clock className="h-6 w-6 text-purple-400 mx-auto" />
              </div>
              <p className="text-2xl font-bold text-white">
                {Math.round(exercises.reduce((total, ex) => total + (parseInt(ex.duration) || 0) + (parseInt(ex.rest) || 0), 0) / 60)}
              </p>
              <p className="text-sm text-slate-400">Est. Minutes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-xl mb-2">
                <Zap className="h-6 w-6 text-green-400 mx-auto" />
              </div>
              <p className="text-2xl font-bold text-white">
                {workoutTypes.find(t => t.id === workoutType)?.name.split(' ')[0]}
              </p>
              <p className="text-sm text-slate-400">Type</p>
            </div>
          </div>

          <button
            onClick={saveWorkout}
            disabled={!workoutName || exercises.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>Save Workout</span>
          </button>
        </section>
      )}
    </main>
  );
}
