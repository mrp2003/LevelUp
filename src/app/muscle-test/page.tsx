'use client';

import { MuscleTagExample } from '@/components/MuscleSelector';
import { getAllMuscleSelections } from '@/lib/muscleGroups';

export default function MuscleTestPage() {
  const allSelections = getAllMuscleSelections();
  
  // Example: Show what happens when "Biceps Brachii - Long Head" is selected
  const bicepsExample = allSelections.find(s => 
    s.subMuscle === 'Biceps Brachii' && s.head === 'Long Head'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Muscle Tagging System Test
        </h1>

        {/* Interactive Demo */}
        <div className="mb-12">
          <MuscleTagExample />
        </div>

        {/* Example Explanation */}
        {bicepsExample && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Example: Biceps Brachii - Long Head
            </h2>
            <p className="text-zinc-300 mb-4">
              When you select "Biceps Brachii - Long Head", the exercise automatically gets these tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {bicepsExample.tags.map((tag, index) => (
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

        {/* All Available Selections Preview */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            All Available Muscle Selections ({allSelections.length})
          </h2>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {allSelections.slice(0, 20).map((selection, index) => (
              <div key={index} className="border-b border-zinc-700 pb-2">
                <div className="text-white font-medium mb-1">
                  {selection.displayName}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selection.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {allSelections.length > 20 && (
              <div className="text-zinc-400 text-center py-2">
                ... and {allSelections.length - 20} more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}