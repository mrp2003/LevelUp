"use client";

import { useState, useEffect } from 'react';
import { Settings, Plus, Edit, Trash2, Dumbbell, Clock, Target, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Machine {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface Exercise {
  id: string;
  name: string;
  type: 'bodyweight' | 'machine';
  machineId?: string;
  muscleGroups: string[];
  timePerRep: number; // seconds
  description: string;
}

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restTime: number; // seconds between sets
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  totalTime: number; // calculated in minutes
}

export default function AdminSettingsPage() {
  // State for machines
  const [machines, setMachines] = useState<Machine[]>([
    { id: '1', name: 'Bench Press', type: 'Strength', description: 'Adjustable bench with barbell rack' },
    { id: '2', name: 'Treadmill', type: 'Cardio', description: 'Electric treadmill with incline' },
    { id: '3', name: 'Lat Pulldown', type: 'Strength', description: 'Cable machine for back exercises' }
  ]);

  // State for exercises
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Push-ups', type: 'bodyweight', muscleGroups: ['Chest', 'Triceps'], timePerRep: 2, description: 'Standard push-up exercise' },
    { id: '2', name: 'Bench Press', type: 'machine', machineId: '1', muscleGroups: ['Chest', 'Triceps'], timePerRep: 3, description: 'Barbell bench press' },
    { id: '3', name: 'Squats', type: 'bodyweight', muscleGroups: ['Legs', 'Glutes'], timePerRep: 2, description: 'Bodyweight squats' }
  ]);

  // State for workout plans
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: '1',
      name: 'Upper Body Strength',
      description: 'Focus on chest, shoulders, and arms',
      exercises: [
        { exerciseId: '1', sets: 3, reps: 12, restTime: 30 },
        { exerciseId: '2', sets: 4, reps: 8, restTime: 60 }
      ],
      totalTime: 25
    }
  ]);

  // Form states
  const [showMachineForm, setShowMachineForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'machines' | 'exercises' | 'workouts'>('machines');

  // Form data states
  const [machineForm, setMachineForm] = useState({ name: '', type: '', description: '' });
  const [exerciseForm, setExerciseForm] = useState({
    name: '', type: 'bodyweight' as 'bodyweight' | 'machine', machineId: '', 
    muscleGroups: '', timePerRep: 2, description: ''
  });
  const [workoutForm, setWorkoutForm] = useState({
    name: '', description: '', exercises: [] as WorkoutExercise[]
  });

  // Calculate workout time
  const calculateWorkoutTime = (workoutExercises: WorkoutExercise[]): number => {
    let totalTime = 5; // 5 minutes buffer time
    
    workoutExercises.forEach(we => {
      const exercise = exercises.find(e => e.id === we.exerciseId);
      if (exercise) {
        // Time per set = (reps * timePerRep) + restTime
        const timePerSet = (we.reps * exercise.timePerRep) + we.restTime;
        // Total time for exercise = timePerSet * sets - restTime (no rest after last set)
        const exerciseTime = (timePerSet * we.sets) - we.restTime;
        totalTime += exerciseTime / 60; // Convert to minutes
      }
    });
    
    return Math.round(totalTime);
  };

  // Handle form submissions
  const handleMachineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMachine: Machine = {
      id: Date.now().toString(),
      ...machineForm
    };
    setMachines([...machines, newMachine]);
    setMachineForm({ name: '', type: '', description: '' });
    setShowMachineForm(false);
  };

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseForm.name,
      type: exerciseForm.type,
      machineId: exerciseForm.type === 'machine' ? exerciseForm.machineId : undefined,
      muscleGroups: exerciseForm.muscleGroups.split(',').map(mg => mg.trim()),
      timePerRep: exerciseForm.timePerRep,
      description: exerciseForm.description
    };
    setExercises([...exercises, newExercise]);
    setExerciseForm({
      name: '', type: 'bodyweight', machineId: '', 
      muscleGroups: '', timePerRep: 2, description: ''
    });
    setShowExerciseForm(false);
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalTime = calculateWorkoutTime(workoutForm.exercises);
    const newWorkout: WorkoutPlan = {
      id: Date.now().toString(),
      name: workoutForm.name,
      description: workoutForm.description,
      exercises: workoutForm.exercises,
      totalTime
    };
    setWorkoutPlans([...workoutPlans, newWorkout]);
    setWorkoutForm({ name: '', description: '', exercises: [] });
    setShowWorkoutForm(false);
  };

  const addExerciseToWorkout = () => {
    setWorkoutForm({
      ...workoutForm,
      exercises: [...workoutForm.exercises, { exerciseId: '', sets: 3, reps: 10, restTime: 30 }]
    });
  };

  const updateWorkoutExercise = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    const updatedExercises = [...workoutForm.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
  };

  const removeWorkoutExercise = (index: number) => {
    const updatedExercises = workoutForm.exercises.filter((_, i) => i !== index);
    setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Settings</h1>
          <p className="text-zinc-400">Manage gym equipment, exercises, and workout plans</p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-zinc-800/50 p-1 rounded-2xl border border-zinc-700/50">
        <div className="flex space-x-1">
          {[
            { id: 'machines', label: 'Machines & Equipment', icon: Dumbbell },
            { id: 'exercises', label: 'Exercises', icon: Target },
            { id: 'workouts', label: 'Workout Plans', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'theme-gradient text-white shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Machines Tab */}
      {activeTab === 'machines' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Gym Equipment</h2>
            <button
              onClick={() => setShowMachineForm(true)}
              className="theme-gradient text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Machine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map((machine) => (
              <div key={machine.id} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{machine.name}</h3>
                    <span className="text-xs theme-text bg-zinc-700/50 px-2 py-1 rounded-lg">
                      {machine.type}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-zinc-700 rounded transition-colors">
                      <Edit className="h-3 w-3 text-zinc-400" />
                    </button>
                    <button className="p-1 hover:bg-zinc-700 rounded transition-colors">
                      <Trash2 className="h-3 w-3 text-zinc-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">{machine.description}</p>
              </div>
            ))}
          </div>

          {/* Add Machine Form */}
          {showMachineForm && (
            <div className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Add New Machine</h3>
                <button
                  onClick={() => setShowMachineForm(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleMachineSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Machine Name"
                    value={machineForm.name}
                    onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Type (e.g., Strength, Cardio)"
                    value={machineForm.type}
                    onChange={(e) => setMachineForm({ ...machineForm, type: e.target.value })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                    required
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={machineForm.description}
                  onChange={(e) => setMachineForm({ ...machineForm, description: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="theme-gradient text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  Add Machine
                </button>
              </form>
            </div>
          )}
        </section>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Exercise Library</h2>
            <button
              onClick={() => setShowExerciseForm(true)}
              className="theme-gradient text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Exercise</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{exercise.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        exercise.type === 'bodyweight' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {exercise.type}
                      </span>
                      {exercise.machineId && (
                        <span className="text-xs text-zinc-400">
                          {machines.find(m => m.id === exercise.machineId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-zinc-700 rounded transition-colors">
                      <Edit className="h-3 w-3 text-zinc-400" />
                    </button>
                    <button className="p-1 hover:bg-zinc-700 rounded transition-colors">
                      <Trash2 className="h-3 w-3 text-zinc-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.map((mg, index) => (
                      <span key={index} className="text-xs bg-zinc-700/50 text-zinc-300 px-2 py-1 rounded">
                        {mg}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400">{exercise.description}</p>
                  <p className="text-xs text-zinc-500">{exercise.timePerRep}s per rep</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Exercise Form */}
          {showExerciseForm && (
            <div className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Add New Exercise</h3>
                <button
                  onClick={() => setShowExerciseForm(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleExerciseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                    required
                  />
                  <select
                    value={exerciseForm.type}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, type: e.target.value as 'bodyweight' | 'machine' })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 theme-focus"
                  >
                    <option value="bodyweight">Bodyweight</option>
                    <option value="machine">Machine</option>
                  </select>
                </div>
                
                {exerciseForm.type === 'machine' && (
                  <select
                    value={exerciseForm.machineId}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, machineId: e.target.value })}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 theme-focus"
                    required
                  >
                    <option value="">Select Machine</option>
                    {machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>{machine.name}</option>
                    ))}
                  </select>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Muscle Groups (comma separated)"
                    value={exerciseForm.muscleGroups}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, muscleGroups: e.target.value })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Time per rep (seconds)"
                    value={exerciseForm.timePerRep}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, timePerRep: parseInt(e.target.value) })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                    min="1"
                    max="10"
                    required
                  />
                </div>
                
                <textarea
                  placeholder="Description"
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus resize-none"
                  rows={3}
                />
                
                <button
                  type="submit"
                  className="theme-gradient text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  Add Exercise
                </button>
              </form>
            </div>
          )}
        </section>
      )}

      {/* Workout Plans Tab */}
      {activeTab === 'workouts' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Workout Plans</h2>
            <button
              onClick={() => setShowWorkoutForm(true)}
              className="theme-gradient text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </button>
          </div>

          <div className="space-y-4">
            {workoutPlans.map((plan) => (
              <div key={plan.id} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <p className="text-zinc-400 mt-1">{plan.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm theme-text">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {plan.totalTime} minutes
                      </span>
                      <span className="text-sm text-zinc-400">
                        {plan.exercises.length} exercises
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 text-zinc-400" />
                    </button>
                    <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {plan.exercises.map((we, index) => {
                    const exercise = exercises.find(e => e.id === we.exerciseId);
                    return (
                      <div key={index} className="bg-zinc-700/30 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{exercise?.name}</span>
                          <span className="text-zinc-400 text-sm">
                            {we.sets} sets × {we.reps} reps
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Create Workout Form */}
          {showWorkoutForm && (
            <div className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Create Workout Plan</h3>
                <button
                  onClick={() => setShowWorkoutForm(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleWorkoutSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Workout Plan Name"
                    value={workoutForm.name}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                    className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 theme-text" />
                    <span className="text-white">
                      Est. Time: {calculateWorkoutTime(workoutForm.exercises)} min
                    </span>
                  </div>
                </div>
                
                <textarea
                  placeholder="Description"
                  value={workoutForm.description}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus resize-none"
                  rows={2}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Exercises</h4>
                    <button
                      type="button"
                      onClick={addExerciseToWorkout}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      Add Exercise
                    </button>
                  </div>
                  
                  {workoutForm.exercises.map((we, index) => (
                    <div key={index} className="bg-zinc-700/50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Exercise {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeWorkoutExercise(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                          value={we.exerciseId}
                          onChange={(e) => updateWorkoutExercise(index, 'exerciseId', e.target.value)}
                          className="bg-zinc-600 border border-zinc-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 theme-focus"
                          required
                        >
                          <option value="">Select Exercise</option>
                          {exercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                          ))}
                        </select>
                        
                        <input
                          type="number"
                          placeholder="Sets"
                          value={we.sets}
                          onChange={(e) => updateWorkoutExercise(index, 'sets', parseInt(e.target.value))}
                          className="bg-zinc-600 border border-zinc-500 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                          min="1"
                          required
                        />
                        
                        <input
                          type="number"
                          placeholder="Reps"
                          value={we.reps}
                          onChange={(e) => updateWorkoutExercise(index, 'reps', parseInt(e.target.value))}
                          className="bg-zinc-600 border border-zinc-500 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                          min="1"
                          required
                        />
                        
                        <input
                          type="number"
                          placeholder="Rest (sec)"
                          value={we.restTime}
                          onChange={(e) => updateWorkoutExercise(index, 'restTime', parseInt(e.target.value))}
                          className="bg-zinc-600 border border-zinc-500 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  type="submit"
                  className="theme-gradient text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                  disabled={workoutForm.exercises.length === 0}
                >
                  <Save className="h-4 w-4" />
                  <span>Create Workout Plan</span>
                </button>
              </form>
            </div>
          )}
        </section>
      )}
    </main>
  );
}