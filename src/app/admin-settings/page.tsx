"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Dumbbell, Clock, Target, Save, X, LogOut } from 'lucide-react';

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
  const router = useRouter();

  // Check admin authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('admin-logged-in') === 'true';
    const loginTime = localStorage.getItem('admin-login-time');

    // Check if admin session is valid (expires after 24 hours)
    if (!isAdminLoggedIn || !loginTime || Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('admin-logged-in');
      localStorage.removeItem('admin-login-time');
      router.push('/admin');
      return;
    }
  }, [router]);

  const handleAdminLogout = () => {
    localStorage.removeItem('admin-logged-in');
    localStorage.removeItem('admin-login-time');
    router.push('/admin');
  };

  // State for machines
  const [machines, setMachines] = useState<Machine[]>([
    // Chest Machines
    { id: '1', name: 'Incline Chest Press Machine', type: 'Chest', description: 'Incline chest press for upper chest development' },
    { id: '2', name: 'Chest Press Machine', type: 'Chest', description: 'Standard chest press machine for chest development' },
    { id: '3', name: 'Decline Chest Press Machine', type: 'Chest', description: 'Decline chest press for lower chest development' },
    
    // Back Machines
    { id: '4', name: 'Lat Pulldown Machine', type: 'Back', description: 'Cable machine for lat pulldown exercises' },
    { id: '5', name: 'Shrug Machine', type: 'Back', description: 'Machine for shoulder shrug exercises' },
    { id: '6', name: 'Cable Row Machine', type: 'Back', description: 'Seated cable row machine for back development' },
    { id: '7', name: 'Rear Delt Machine', type: 'Back', description: 'Machine for rear deltoid and upper back exercises' },
    { id: '8', name: 'Hyperextension Bench', type: 'Back', description: 'Bench for lower back hyperextension exercises' },
    
    // Shoulder Machines
    { id: '9', name: 'Lateral Raise Machine', type: 'Shoulders', description: 'Machine for lateral deltoid raises' },
    
    // Arm Machines
    { id: '10', name: 'Preacher Curl Machine', type: 'Arms', description: 'Machine for isolated bicep curls' },
    { id: '11', name: 'Smith Machine', type: 'Arms', description: 'Multi-purpose guided barbell machine' },
    { id: '12', name: 'Wrist Curl Machine', type: 'Arms', description: 'Machine for forearm and wrist exercises' },
    
    // Core Machines
    { id: '13', name: 'Ab Crunch Machine', type: 'Core', description: 'Machine for abdominal crunches' },
    
    // Leg Machines
    { id: '14', name: 'Leg Press Machine', type: 'Legs', description: 'Machine for leg press exercises' },
    { id: '15', name: 'Hack Squat Machine', type: 'Legs', description: 'Machine for hack squat exercises' },
    { id: '16', name: 'Leg Extension Machine', type: 'Legs', description: 'Machine for quadriceps extensions' },
    { id: '17', name: 'Leg Curl Machine', type: 'Legs', description: 'Machine for hamstring curls' },
    { id: '18', name: 'Hip Thrust Machine', type: 'Legs', description: 'Machine for hip thrust and glute exercises' },
    { id: '19', name: 'Standing Calf Raise Machine', type: 'Legs', description: 'Machine for standing calf raises' },
    { id: '20', name: 'Seated Calf Raise Machine', type: 'Legs', description: 'Machine for seated calf raises' },
    
    // Multi-purpose Machines
    { id: '21', name: 'Cable Machine', type: 'Multi-purpose', description: 'Versatile cable machine for various exercises' }
  ]);

  // State for exercises
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Push-ups', type: 'bodyweight', muscleGroups: ['Chest', 'Triceps'], timePerRep: 2, description: 'Standard push-up exercise' },
    { id: '2', name: 'Bench Press', type: 'machine', machineId: '1', muscleGroups: ['Chest', 'Triceps'], timePerRep: 3, description: 'Barbell bench press' },
    { id: '3', name: 'Squats', type: 'bodyweight', muscleGroups: ['Legs', 'Glutes'], timePerRep: 2, description: 'Bodyweight squats' },
    
    // Chest Exercises
    { id: '4', name: 'Incline Bench Press', type: 'machine', machineId: '1', muscleGroups: ['Chest'], timePerRep: 3, description: 'Incline chest press targeting upper chest' },
    { id: '5', name: 'Flat Bench Press', type: 'machine', machineId: '2', muscleGroups: ['Chest'], timePerRep: 3, description: 'Standard flat bench press for overall chest development' },
    { id: '6', name: 'Decline Bench Press', type: 'machine', machineId: '3', muscleGroups: ['Chest'], timePerRep: 3, description: 'Decline bench press targeting lower chest' },
    
    // Back Exercises
    { id: '7', name: 'Lat Pulldown', type: 'machine', machineId: '4', muscleGroups: ['Back'], timePerRep: 3, description: 'Cable lat pulldown for back width' },
    { id: '8', name: 'Shrugs', type: 'machine', machineId: '5', muscleGroups: ['Back'], timePerRep: 2, description: 'Shoulder shrugs for upper traps' },
    { id: '9', name: 'Seated Rows', type: 'machine', machineId: '6', muscleGroups: ['Back'], timePerRep: 3, description: 'Cable rows for back thickness' },
    { id: '10', name: 'Reverse Pec Deck', type: 'machine', machineId: '7', muscleGroups: ['Back'], timePerRep: 2, description: 'Rear delt flyes for posterior deltoids' },
    { id: '11', name: 'Face Pulls', type: 'machine', machineId: '21', muscleGroups: ['Back'], timePerRep: 2, description: 'Cable face pulls for rear delts and upper back' },
    { id: '12', name: 'Straight-Arm Pulldown', type: 'machine', machineId: '21', muscleGroups: ['Back'], timePerRep: 2, description: 'Cable straight-arm pulldown for lats' },
    { id: '13', name: 'Back Extensions', type: 'machine', machineId: '8', muscleGroups: ['Back'], timePerRep: 3, description: 'Hyperextension for lower back strength' },
    
    // Shoulder Exercises
    { id: '14', name: 'Cable Front Raise', type: 'machine', machineId: '21', muscleGroups: ['Shoulders'], timePerRep: 2, description: 'Cable front raises for anterior deltoids' },
    { id: '15', name: 'Lateral Raise', type: 'machine', machineId: '9', muscleGroups: ['Shoulders'], timePerRep: 2, description: 'Lateral raises for side deltoids' },
    { id: '16', name: 'Reverse Flyes', type: 'machine', machineId: '7', muscleGroups: ['Shoulders'], timePerRep: 2, description: 'Reverse flyes for rear deltoids' },
    
    // Arms Exercises
    { id: '17', name: 'Preacher Curl', type: 'machine', machineId: '10', muscleGroups: ['Arms'], timePerRep: 2, description: 'Preacher curls for isolated bicep development' },
    { id: '18', name: 'Concentration Curl', type: 'machine', machineId: '21', muscleGroups: ['Arms'], timePerRep: 2, description: 'Cable concentration curls for bicep peak' },
    { id: '19', name: 'Hammer Curls', type: 'machine', machineId: '21', muscleGroups: ['Arms'], timePerRep: 2, description: 'Cable hammer curls for biceps and forearms' },
    { id: '20', name: 'Reverse Curl', type: 'machine', machineId: '21', muscleGroups: ['Arms'], timePerRep: 2, description: 'Cable reverse curls for forearms and biceps' },
    { id: '21', name: 'Overhead Triceps Extension', type: 'machine', machineId: '21', muscleGroups: ['Arms'], timePerRep: 2, description: 'Cable overhead extension for triceps' },
    { id: '22', name: 'Triceps Pushdown', type: 'machine', machineId: '21', muscleGroups: ['Arms'], timePerRep: 2, description: 'Cable triceps pushdown for tricep development' },
    { id: '23', name: 'Close-Grip Bench Press', type: 'machine', machineId: '2', muscleGroups: ['Arms'], timePerRep: 3, description: 'Close-grip bench press for triceps' },
    { id: '24', name: 'Wrist Curls', type: 'machine', machineId: '12', muscleGroups: ['Arms'], timePerRep: 1, description: 'Wrist curls for forearm flexors' },
    { id: '25', name: 'Reverse Wrist Curls', type: 'machine', machineId: '12', muscleGroups: ['Arms'], timePerRep: 1, description: 'Reverse wrist curls for forearm extensors' },
    
    // Core Exercises
    { id: '26', name: 'Crunches', type: 'machine', machineId: '13', muscleGroups: ['Core'], timePerRep: 2, description: 'Machine crunches for abdominal development' },
    { id: '27', name: 'Cable Woodchoppers', type: 'machine', machineId: '21', muscleGroups: ['Core'], timePerRep: 2, description: 'Cable woodchoppers for obliques and core rotation' },
    { id: '28', name: 'Planks', type: 'bodyweight', muscleGroups: ['Core'], timePerRep: 1, description: 'Isometric plank hold for core stability' },
    
    // Legs Exercises
    { id: '29', name: 'Leg Press', type: 'machine', machineId: '14', muscleGroups: ['Legs'], timePerRep: 3, description: 'Leg press for overall leg development' },
    { id: '30', name: 'Hack Squats', type: 'machine', machineId: '15', muscleGroups: ['Legs'], timePerRep: 3, description: 'Hack squats for quadriceps development' },
    { id: '31', name: 'Sissy Squats', type: 'machine', machineId: '16', muscleGroups: ['Legs'], timePerRep: 2, description: 'Sissy squats for quadriceps isolation' },
    { id: '32', name: 'Leg Extension', type: 'machine', machineId: '16', muscleGroups: ['Legs'], timePerRep: 2, description: 'Leg extensions for quadriceps isolation' },
    { id: '33', name: 'Romanian Deadlifts', type: 'machine', machineId: '11', muscleGroups: ['Legs'], timePerRep: 3, description: 'Romanian deadlifts for hamstrings and glutes' },
    { id: '34', name: 'Lying Leg Curl', type: 'machine', machineId: '17', muscleGroups: ['Legs'], timePerRep: 2, description: 'Lying leg curls for hamstring development' },
    { id: '35', name: 'Seated Leg Curl', type: 'machine', machineId: '17', muscleGroups: ['Legs'], timePerRep: 2, description: 'Seated leg curls for hamstring isolation' },
    { id: '36', name: 'Hip Thrusts', type: 'machine', machineId: '18', muscleGroups: ['Legs'], timePerRep: 2, description: 'Hip thrusts for glute development' },
    { id: '37', name: 'Cable Abduction', type: 'machine', machineId: '21', muscleGroups: ['Legs'], timePerRep: 2, description: 'Cable hip abduction for glute medius' },
    { id: '38', name: 'Side-Lying Leg Raise', type: 'bodyweight', muscleGroups: ['Legs'], timePerRep: 1, description: 'Side-lying leg raises for hip abductors' },
    { id: '39', name: 'Standing Calf Raise', type: 'machine', machineId: '19', muscleGroups: ['Legs'], timePerRep: 2, description: 'Standing calf raises for gastrocnemius' },
    { id: '40', name: 'Seated Calf Raise', type: 'machine', machineId: '20', muscleGroups: ['Legs'], timePerRep: 2, description: 'Seated calf raises for soleus' }
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

  // Edit states
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

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

  // Machine CRUD functions
  const handleMachineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMachine) {
      // Update existing machine
      setMachines(machines.map(machine => 
        machine.id === editingMachine.id 
          ? { ...editingMachine, ...machineForm }
          : machine
      ));
      setEditingMachine(null);
    } else {
      // Add new machine
      const newMachine: Machine = {
        id: Date.now().toString(),
        ...machineForm
      };
      setMachines([...machines, newMachine]);
    }
    setMachineForm({ name: '', type: '', description: '' });
    setShowMachineForm(false);
  };

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine);
    setMachineForm({
      name: machine.name,
      type: machine.type,
      description: machine.description
    });
    setShowMachineForm(true);
  };

  const handleDeleteMachine = (machineId: string) => {
    if (confirm('Are you sure you want to delete this machine? This action cannot be undone.')) {
      setMachines(machines.filter(machine => machine.id !== machineId));
      // Also remove machine references from exercises
      setExercises(exercises.map(exercise => 
        exercise.machineId === machineId 
          ? { ...exercise, type: 'bodyweight' as const, machineId: undefined }
          : exercise
      ));
    }
  };

  const handleCancelMachineEdit = () => {
    setEditingMachine(null);
    setMachineForm({ name: '', type: '', description: '' });
    setShowMachineForm(false);
  };

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExercise) {
      // Update existing exercise
      const updatedExercise: Exercise = {
        ...editingExercise,
        name: exerciseForm.name,
        type: exerciseForm.type,
        machineId: exerciseForm.type === 'machine' ? exerciseForm.machineId : undefined,
        muscleGroups: exerciseForm.muscleGroups.split(',').map(mg => mg.trim()),
        timePerRep: exerciseForm.timePerRep,
        description: exerciseForm.description
      };
      setExercises(exercises.map(exercise => 
        exercise.id === editingExercise.id ? updatedExercise : exercise
      ));
      setEditingExercise(null);
    } else {
      // Add new exercise
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
    }
    setExerciseForm({
      name: '', type: 'bodyweight', machineId: '',
      muscleGroups: '', timePerRep: 2, description: ''
    });
    setShowExerciseForm(false);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.name,
      type: exercise.type,
      machineId: exercise.machineId || '',
      muscleGroups: exercise.muscleGroups.join(', '),
      timePerRep: exercise.timePerRep,
      description: exercise.description
    });
    setShowExerciseForm(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
      // Also remove exercise references from workout plans
      setWorkoutPlans(workoutPlans.map(plan => ({
        ...plan,
        exercises: plan.exercises.filter(we => we.exerciseId !== exerciseId),
        totalTime: calculateWorkoutTime(plan.exercises.filter(we => we.exerciseId !== exerciseId))
      })));
    }
  };

  const handleCancelExerciseEdit = () => {
    setEditingExercise(null);
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
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-auto z-50">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Admin Settings</h1>
              <p className="text-zinc-400">Manage gym equipment, exercises, and workout plans</p>
            </div>
            <button
              onClick={handleAdminLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Admin Logout</span>
            </button>
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
                  onClick={() => setActiveTab(tab.id as 'machines' | 'exercises' | 'workouts')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${activeTab === tab.id
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
              {machines.map((machine) => {
                // Define colors for different machine types
                const getTypeColor = (type: string) => {
                  switch (type) {
                    case 'Chest':
                      return 'bg-red-500/20 text-red-400 border-red-500/30';
                    case 'Back':
                      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                    case 'Shoulders':
                      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                    case 'Arms':
                      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
                    case 'Core':
                      return 'bg-green-500/20 text-green-400 border-green-500/30';
                    case 'Legs':
                      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                    case 'Multi-purpose':
                      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
                    default:
                      return 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50';
                  }
                };

                return (
                  <div key={machine.id} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{machine.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-lg border ${getTypeColor(machine.type)}`}>
                          {machine.type}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleEditMachine(machine)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                          title="Edit machine"
                        >
                          <Edit className="h-3 w-3 text-zinc-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMachine(machine.id)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                          title="Delete machine"
                        >
                          <Trash2 className="h-3 w-3 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">{machine.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Add/Edit Machine Form */}
            {showMachineForm && (
              <div className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {editingMachine ? 'Edit Machine' : 'Add New Machine'}
                  </h3>
                  <button
                    onClick={handleCancelMachineEdit}
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
                    <select
                      value={machineForm.type}
                      onChange={(e) => setMachineForm({ ...machineForm, type: e.target.value })}
                      className="bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 theme-focus"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Chest">Chest</option>
                      <option value="Back">Back</option>
                      <option value="Shoulders">Shoulders</option>
                      <option value="Arms">Arms</option>
                      <option value="Core">Core</option>
                      <option value="Legs">Legs</option>
                      <option value="Multi-purpose">Multi-purpose</option>
                      <option value="Cardio">Cardio</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={machineForm.description}
                    onChange={(e) => setMachineForm({ ...machineForm, description: e.target.value })}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus resize-none"
                    rows={3}
                    required
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="theme-gradient text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingMachine ? 'Update Machine' : 'Add Machine'}</span>
                    </button>
                    {editingMachine && (
                      <button
                        type="button"
                        onClick={handleCancelMachineEdit}
                        className="bg-zinc-600 hover:bg-zinc-500 text-white px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => {
                // Function to get muscle group color
                const getMuscleGroupColor = (muscleGroup: string) => {
                  switch (muscleGroup) {
                    case 'Chest':
                      return 'bg-green-500/20 text-green-400 border-green-500/30';
                    case 'Back':
                      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                    case 'Shoulders':
                      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                    case 'Arms':
                      return 'bg-red-500/20 text-red-400 border-red-500/30';
                    case 'Legs':
                      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                    case 'Core':
                      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
                    default:
                      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
                  }
                };

                return (
                  <div key={exercise.id} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{exercise.name}</h3>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleEditExercise(exercise)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                          title="Edit exercise"
                        >
                          <Edit className="h-3 w-3 text-zinc-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                          title="Delete exercise"
                        >
                          <Trash2 className="h-3 w-3 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {/* Colored muscle group tags */}
                        {exercise.muscleGroups.map((mg, index) => (
                          <span key={`muscle-${index}`} className={`text-xs px-2 py-1 rounded border ${getMuscleGroupColor(mg)}`}>
                            {mg}
                          </span>
                        ))}
                        {/* Grey machine tag */}
                        {exercise.machineId && (
                          <span className="text-xs px-2 py-1 rounded border bg-zinc-600/20 text-zinc-400 border-zinc-600/30">
                            {machines.find(m => m.id === exercise.machineId)?.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">{exercise.description}</p>
                      <p className="text-xs text-zinc-500">{exercise.timePerRep}s per rep</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Exercise Form */}
            {showExerciseForm && (
              <div className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
                  </h3>
                  <button
                    onClick={handleCancelExerciseEdit}
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

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="theme-gradient text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingExercise ? 'Update Exercise' : 'Add Exercise'}</span>
                    </button>
                    {editingExercise && (
                      <button
                        type="button"
                        onClick={handleCancelExerciseEdit}
                        className="bg-zinc-600 hover:bg-zinc-500 text-white px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
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
    </div>
  );
}