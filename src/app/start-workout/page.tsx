"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, CheckCircle, Clock, Target, Zap } from 'lucide-react';

export default function StartWorkoutPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isResting, setIsResting] = useState(false);

  const exercises = [
    { name: 'Push-ups', duration: 45, reps: '12-15', difficulty: 'Medium' },
    { name: 'Squats', duration: 60, reps: '15-20', difficulty: 'Easy' },
    { name: 'Plank', duration: 30, reps: 'Hold', difficulty: 'Medium' },
    { name: 'Lunges', duration: 45, reps: '10 each leg', difficulty: 'Medium' },
    { name: 'Burpees', duration: 30, reps: '8-10', difficulty: 'Hard' },
    { name: 'Mountain Climbers', duration: 45, reps: '20-30', difficulty: 'Hard' },
  ];

  const currentEx = exercises[currentExercise];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isResting) {
        setIsResting(true);
        setTimeLeft(15); // 15 second rest
      } else {
        setIsResting(false);
        if (currentExercise < exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          setTimeLeft(exercises[currentExercise + 1].duration);
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentExercise, isResting, exercises]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimeLeft(exercises[currentExercise + 1].duration);
      setIsActive(false);
      setIsResting(false);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setTimeLeft(exercises[currentExercise - 1].duration);
      setIsActive(false);
      setIsResting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Upper Body Strength</h1>
        <p className="text-zinc-400">Exercise {currentExercise + 1} of {exercises.length}</p>
      </section>

      {/* Progress Bar */}
      <section className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Progress</span>
          <span className="text-sm text-zinc-400">{Math.round(((currentExercise + 1) / exercises.length) * 100)}%</span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </section>

      {/* Current Exercise Card */}
      <section className="bg-gradient-to-r from-orange-600/20 to-pink-600/20 border border-orange-500/30 p-8 rounded-2xl text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isResting ? 'Rest Time' : currentEx.name}
          </h2>
          {!isResting && (
            <div className="flex items-center justify-center space-x-4 text-zinc-300">
              <span className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{currentEx.reps}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>{currentEx.difficulty}</span>
              </span>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-white mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="w-32 h-32 mx-auto relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - (timeLeft / (isResting ? 15 : currentEx.duration)))}`}
                className="transition-all duration-1000"
              />
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={prevExercise}
            disabled={currentExercise === 0}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={toggleTimer}
            className="p-4 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            {isActive ? (
              <Pause className="h-8 w-8 text-orange-600" />
            ) : (
              <Play className="h-8 w-8 text-orange-600" />
            )}
          </button>

          <button
            onClick={nextExercise}
            disabled={currentExercise === exercises.length - 1}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="h-6 w-6 text-white" />
          </button>
        </div>
      </section>

      {/* Exercise Instructions */}
      {!isResting && (
        <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
          <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
          <div className="space-y-2 text-zinc-300">
            <p>• Keep your core engaged throughout the movement</p>
            <p>• Focus on controlled, steady movements</p>
            <p>• Breathe steadily - exhale on exertion</p>
            <p>• Stop if you feel any pain or discomfort</p>
          </div>
        </section>
      )}

      {/* Next Exercises Preview */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Coming Up</h3>
        <div className="space-y-3">
          {exercises.slice(currentExercise + 1, currentExercise + 3).map((exercise, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-xl">
              <div>
                <p className="text-white font-medium">{exercise.name}</p>
                <p className="text-zinc-400 text-sm">{exercise.reps}</p>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>{exercise.duration}s</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Workout Button */}
      {currentExercise === exercises.length - 1 && (
        <button className="w-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 text-white font-semibold py-4 rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-200 flex items-center justify-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span>Complete Workout</span>
        </button>
      )}


    </main>
  );
} 