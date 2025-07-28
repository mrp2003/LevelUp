'use client';

import { useState } from 'react';
import { MUSCLE_GROUPS, getAllMuscleSelections } from '@/lib/muscleGroups';
import HumanBody3D from '@/components/HumanBody3D';

export default function MusclesPage() {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedMuscleSelection, setSelectedMuscleSelection] = useState<{
    group: string;
    muscle: string;
    subMuscle?: string;
    head?: string;
    displayName: string;
    tags: any[];
  } | null>(null);

  const allSelections = getAllMuscleSelections();

  // Filter selections based on selected muscle group
  const filteredSelections = selectedMuscleGroup
    ? allSelections.filter(s => s.group === selectedMuscleGroup)
    : allSelections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Muscle Explorer
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Explore muscle groups and see how they&apos;re tagged in our system.
            Select a muscle group to filter and highlight it on the 3D model.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Muscle Groups */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 border border-zinc-700/50 h-[700px] flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-6">Muscle Groups</h2>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {MUSCLE_GROUPS.map((group) => (
                  <button
                    key={group.name}
                    onClick={() => {
                      setSelectedMuscleGroup(selectedMuscleGroup === group.name ? null : group.name);
                      // Clear individual muscle selection when selecting muscle group
                      if (selectedMuscleSelection) {
                        setSelectedMuscleSelection(null);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${selectedMuscleGroup === group.name
                      ? 'bg-zinc-700/50 border-opacity-100'
                      : 'bg-zinc-800/30 border-opacity-30 hover:bg-zinc-700/30 hover:border-opacity-50'
                      }`}
                    style={{
                      borderColor: group.color,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{group.name}</span>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: `${group.color}40` }}
                      />
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {group.muscles.length} muscle{group.muscles.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - 3D Body Model */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50 h-[700px] flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">3D Body Model</h2>
              <div className="flex-1 overflow-hidden rounded-lg">
                <HumanBody3D
                  selectedMuscleGroup={selectedMuscleGroup}
                  selectedMuscleSelection={selectedMuscleSelection}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Muscle Details */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50 h-[700px] flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-6">
                {selectedMuscleGroup ? `${selectedMuscleGroup} Muscles` : 'All Muscles'}
              </h2>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {filteredSelections.map((selection, index) => {
                  const isSelected = selectedMuscleSelection &&
                    selectedMuscleSelection.group === selection.group &&
                    selectedMuscleSelection.muscle === selection.muscle &&
                    selectedMuscleSelection.subMuscle === selection.subMuscle &&
                    selectedMuscleSelection.head === selection.head;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        // Toggle selection - if already selected, deselect, otherwise select this one
                        if (isSelected) {
                          setSelectedMuscleSelection(null);
                        } else {
                          setSelectedMuscleSelection(selection);
                          // Clear muscle group selection when selecting individual muscle
                          if (selectedMuscleGroup) {
                            setSelectedMuscleGroup(null);
                          }
                        }
                      }}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                        ? 'bg-zinc-700/50 border-zinc-600/80 ring-2 ring-blue-500/30'
                        : 'bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-700/30'
                        }`}
                    >
                      <div className="text-white font-medium mb-2 text-sm">
                        {selection.displayName.split(' > ').pop()}
                      </div>
                      <div className="text-xs text-zinc-400 mb-3">
                        {selection.displayName}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selection.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 rounded-md text-xs font-medium border transition-all duration-200"
                            style={{
                              backgroundColor: `${tag.color}15`,
                              borderColor: `${tag.color}60`,
                              color: tag.color
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      {isSelected && (
                        <div className="mt-2 text-xs text-blue-400 font-medium">
                          ✓ Selected - View on 3D model
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50 text-center">
            <div className="text-3xl font-bold text-white mb-2">{MUSCLE_GROUPS.length}</div>
            <div className="text-zinc-400">Muscle Groups</div>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {MUSCLE_GROUPS.reduce((acc, group) => acc + group.muscles.length, 0)}
            </div>
            <div className="text-zinc-400">Individual Muscles</div>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50 text-center">
            <div className="text-3xl font-bold text-white mb-2">{allSelections.length}</div>
            <div className="text-zinc-400">Total Selections</div>
          </div>
        </div>
      </div>
    </div>
  );
}