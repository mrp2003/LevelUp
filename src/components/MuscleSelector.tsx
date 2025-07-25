'use client';

import { useState } from 'react';
import { getAllMuscleSelections, ExerciseTag } from '@/lib/muscleGroups';

interface MuscleSelectorProps {
  onSelectionChange?: (tags: ExerciseTag[]) => void;
  selectedTags?: ExerciseTag[];
}

export default function MuscleSelector({ onSelectionChange, selectedTags = [] }: MuscleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const allSelections = getAllMuscleSelections();
  const filteredSelections = allSelections.filter(selection =>
    selection.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelection = (tags: ExerciseTag[]) => {
    onSelectionChange?.(tags);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Muscle
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for muscle groups..."
            className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredSelections.map((selection, index) => (
                <button
                  key={index}
                  onClick={() => handleSelection(selection.tags)}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 text-white text-sm border-b border-zinc-700 last:border-b-0"
                >
                  {selection.displayName}
                </button>
              ))}
              {filteredSelections.length === 0 && (
                <div className="px-4 py-2 text-zinc-400 text-sm">
                  No muscles found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Display selected tags */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Generated Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-75">
                  ({tag.level})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Example usage component
export function MuscleTagExample() {
  const [selectedTags, setSelectedTags] = useState<ExerciseTag[]>([]);

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Muscle Tag System Demo</h2>
      
      <MuscleSelector
        selectedTags={selectedTags}
        onSelectionChange={setSelectedTags}
      />

      {selectedTags.length > 0 && (
        <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">
            Exercise would be tagged with:
          </h3>
          <div className="space-y-2">
            {selectedTags.map((tag, index) => (
              <div key={index} className="flex items-center justify-between">
                <span
                  className="px-2 py-1 rounded text-sm text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
                <span className="text-xs text-zinc-400 capitalize">
                  {tag.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}