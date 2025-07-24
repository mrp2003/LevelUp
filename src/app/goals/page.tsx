"use client";

import { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, Award, Edit, Trash2, CheckCircle } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  description: string;
  completed: boolean;
  createdDate: string;
}

export default function GoalsPage() {
  // Mock current goals
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Lose 10kg',
      type: 'Weight Loss',
      targetValue: 10,
      currentValue: 6,
      unit: 'kg',
      targetDate: '2025-06-01',
      description: 'Lose weight for better health and fitness',
      completed: false,
      createdDate: '2025-01-01'
    },
    {
      id: '2',
      name: 'Run 5K',
      type: 'Endurance',
      targetValue: 5,
      currentValue: 3.2,
      unit: 'km',
      targetDate: '2025-03-15',
      description: 'Complete a 5K run without stopping',
      completed: false,
      createdDate: '2025-01-10'
    }
  ]);

  // Mock completed goals
  const [completedGoals] = useState<Goal[]>([
    {
      id: '3',
      name: 'Daily Workouts',
      type: 'Consistency',
      targetValue: 30,
      currentValue: 30,
      unit: 'days',
      targetDate: '2024-12-31',
      description: 'Complete 30 consecutive days of workouts',
      completed: true,
      createdDate: '2024-12-01'
    }
  ]);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    targetDate: '',
    description: ''
  });

  const goalTypes = [
    { value: 'weight-loss', label: 'Weight Loss', unit: 'kg' },
    { value: 'muscle-gain', label: 'Muscle Gain', unit: 'kg' },
    { value: 'endurance', label: 'Endurance', unit: 'km' },
    { value: 'strength', label: 'Strength', unit: 'kg' },
    { value: 'consistency', label: 'Consistency', unit: 'days' },
    { value: 'body-fat', label: 'Body Fat', unit: '%' },
    { value: 'flexibility', label: 'Flexibility', unit: 'cm' },
    { value: 'other', label: 'Other', unit: '' }
  ];

  const handleTypeChange = (type: string) => {
    const selectedType = goalTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type: selectedType?.label || '',
      unit: selectedType?.unit || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue) || 0,
      unit: formData.unit,
      targetDate: formData.targetDate,
      description: formData.description,
      completed: false,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setCurrentGoals([...currentGoals, newGoal]);
    setFormData({
      name: '',
      type: '',
      targetValue: '',
      currentValue: '',
      unit: '',
      targetDate: '',
      description: ''
    });
    setShowCreateForm(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const GoalCard = ({ goal, isCompleted = false }: { goal: Goal; isCompleted?: boolean }) => {
    const progress = getProgressPercentage(goal.currentValue, goal.targetValue);
    
    return (
      <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-semibold text-white">{goal.name}</h4>
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-400" />}
            </div>
            <div className="flex items-center space-x-4 text-sm text-zinc-400 mb-3">
              <span className="bg-zinc-700/50 px-2 py-1 rounded-lg">{goal.type}</span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
              </span>
            </div>
            <p className="text-zinc-300 text-sm mb-4">{goal.description}</p>
          </div>
          
          {!isCompleted && (
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                <Edit className="h-4 w-4 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          )}
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Progress</span>
            <span className="text-white font-medium">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-zinc-500">{progress.toFixed(1)}% complete</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Goals</h1>
          <p className="text-zinc-400">Set, track, and achieve your fitness goals</p>
        </div>
      </section>

      {/* Current Goals */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Target className="h-5 w-5 theme-text" />
            <span>Current Goals ({currentGoals.length})</span>
          </h3>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="theme-gradient text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </button>
        </div>
        
        {currentGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-zinc-500 mx-auto mb-3" />
            <p className="text-zinc-400">No active goals yet</p>
            <p className="text-zinc-500 text-sm">Create your first goal to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>

      {/* Create New Goal Form */}
      {showCreateForm && (
        <section className="theme-gradient-transparent p-6 rounded-2xl border theme-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Plus className="h-5 w-5 theme-text" />
              <span>Create New Goal</span>
            </h3>
            
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goal Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Lose 10kg"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  required
                />
              </div>
              
              {/* Goal Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Goal Type</label>
                <select
                  value={goalTypes.find(t => t.label === formData.type)?.value || ''}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select goal type</option>
                  {goalTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Target Value */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Target Value {formData.unit && `(${formData.unit})`}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  placeholder="e.g., 10"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  required
                />
              </div>
              
              {/* Current Value */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Current Value {formData.unit && `(${formData.unit})`}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  placeholder="e.g., 0"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                />
              </div>
              
              {/* Target Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal and why it's important to you..."
                rows={3}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all resize-none"
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 theme-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Goal History */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <Award className="h-5 w-5 theme-text" />
          <span>Goal History ({completedGoals.length})</span>
        </h3>
        
        {completedGoals.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-zinc-500 mx-auto mb-3" />
            <p className="text-zinc-400">No completed goals yet</p>
            <p className="text-zinc-500 text-sm">Complete your first goal to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} isCompleted={true} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}