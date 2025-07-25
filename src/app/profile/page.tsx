"use client";

import { useState, useEffect } from 'react';
import { User, Scale, Ruler, TrendingUp, Palette } from 'lucide-react';
import GaugeComponent from 'react-gauge-component';
import { useTheme, themes } from '@/contexts/ThemeContext';

export default function ProfilePage() {
  const { currentTheme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100; // Convert cm to meters
      const weightInKg = parseFloat(weight);
      const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);

      // Determine BMI category
      if (calculatedBmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (calculatedBmi < 25) {
        setBmiCategory('Normal');
      } else if (calculatedBmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    } else {
      setBmi(0);
      setBmiCategory('');
    }
  }, [height, weight]);

  const getBmiColor = () => {
    if (bmi === 0) return 'text-zinc-400';
    if (bmi < 18.5) return 'text-blue-400';
    if (bmi < 25) return 'text-green-400';
    if (bmi < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Convert BMI to gauge value (0-100 scale)
  const getBmiGaugeValue = () => {
    if (bmi === 0) return 0;
    // Map BMI ranges to 0-100 scale
    // 0-18.5 -> 0-25, 18.5-25 -> 25-50, 25-30 -> 50-75, 30+ -> 75-100
    if (bmi <= 18.5) {
      return (bmi / 18.5) * 25;
    } else if (bmi <= 25) {
      return 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi <= 30) {
      return 50 + ((bmi - 25) / 5) * 25;
    } else {
      return Math.min(75 + ((bmi - 30) / 10) * 25, 100);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <section>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Profile</h1>
          <p className="text-zinc-400">Manage your personal information and health metrics</p>
        </div>
      </section>

      {/* Personal Information Form */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <User className="h-5 w-5 theme-text" />
          <span>Personal Information</span>
        </h3>

        <div className="space-y-6">
          {/* Name - Full Width */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
            />
          </div>

          {/* Height and Weight Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height in cm"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Weight (kg)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight in kg"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BMI Section - Always Present */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 theme-text" />
          <span>BMI Analysis</span>
        </h3>

        <div className="flex flex-col items-center space-y-6">
          {/* BMI Gauge using react-gauge-component */}
          <div className="w-80 h-48">
            <GaugeComponent
              value={getBmiGaugeValue()}
              type="radial"
              labels={{
                valueLabel: {
                  hide: true
                },
                tickLabels: {
                  type: "inner",
                  ticks: [
                    { value: 25, valueConfig: { formatTextValue: () => "18.5" } },
                    { value: 50, valueConfig: { formatTextValue: () => "25" } },
                    { value: 75, valueConfig: { formatTextValue: () => "30" } }
                  ]
                }
              }}
              arc={{
                colorArray: ['#60a5fa', '#4ade80', '#facc15', '#f87171'],
                subArcs: [
                  { limit: 25 }, // Underweight (0-25)
                  { limit: 50 }, // Normal (25-50)
                  { limit: 75 }, // Overweight (50-75)
                  { limit: 100 } // Obese (75-100)
                ],
                padding: 0.02,
                width: 0.3
              }}
              pointer={{
                elastic: true,
                animationDelay: 0,
                color: '#ffffff'
              }}
              minValue={0}
              maxValue={100}
            />
          </div>

          {/* BMI Score */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getBmiColor()} mb-2`}>
              {bmi === 0 ? '0.0' : bmi.toFixed(1)}
            </div>
            <div className="text-white text-lg font-semibold mb-1">
              BMI Score
            </div>
            <div className={`text-sm font-medium ${getBmiColor()}`}>
              {bmi === 0 ? 'Enter height and weight' : bmiCategory}
            </div>
          </div>


        </div>
      </section>

      {/* Themes Section */}
      <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <Palette className="h-5 w-5 theme-text" />
          <span>Themes</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((theme) => {
            const isActive = currentTheme.id === theme.id;

            return (
              <div key={theme.id} className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => setTheme(theme.id)}
                  className={`w-full h-12 rounded-xl border-2 transition-all duration-200 ${isActive
                    ? 'theme-border'
                    : 'border-zinc-700 hover:border-zinc-600'
                    }`}
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`
                  }}
                ></button>
                <p className={`text-sm font-medium ${isActive ? 'theme-text' : 'text-zinc-400'}`}>
                  {theme.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Action Buttons */}
      <section>
        <button className="w-full theme-gradient text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg">
          Save Profile
        </button>
      </section>
    </main>
  );
}