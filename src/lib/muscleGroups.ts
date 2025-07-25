export interface MuscleGroup {
  name: string;
  color: string;
  muscles: Muscle[];
}

export interface Muscle {
  name: string;
  heads?: MuscleHead[];
  subMuscles?: SubMuscle[];
}

export interface MuscleHead {
  name: string;
}

export interface SubMuscle {
  name: string;
  heads?: MuscleHead[];
}

export interface ExerciseTag {
  name: string;
  color: string;
  level: 'group' | 'muscle' | 'head' | 'subMuscle';
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    name: "Chest",
    color: "#22c55e", // green
    muscles: [
      {
        name: "Pectoralis Major",
        heads: [
          { name: "Upper (Clavicular Head)" },
          { name: "Middle (Sternal Head)" },
          { name: "Lower (Costal Head)" }
        ]
      }
    ]
  },
  {
    name: "Back",
    color: "#3b82f6", // blue
    muscles: [
      { name: "Latissimus Dorsi" },
      {
        name: "Trapezius",
        heads: [
          { name: "Upper" },
          { name: "Middle" },
          { name: "Lower" }
        ]
      },
      { name: "Rhomboids" },
      { name: "Teres Major" },
      { name: "Erector Spinae (Lower Back)" }
    ]
  },
  {
    name: "Shoulders",
    color: "#eab308", // yellow
    muscles: [
      {
        name: "Deltoids",
        heads: [
          { name: "Anterior Deltoid (Front)" },
          { name: "Lateral Deltoid (Side)" },
          { name: "Posterior Deltoid (Rear)" }
        ]
      }
    ]
  },
  {
    name: "Arms",
    color: "#ef4444", // red
    muscles: [
      {
        name: "Biceps",
        subMuscles: [
          {
            name: "Biceps Brachii",
            heads: [
              { name: "Long Head" },
              { name: "Short Head" }
            ]
          },
          { name: "Brachialis" },
          { name: "Brachioradialis" }
        ]
      },
      {
        name: "Triceps",
        heads: [
          { name: "Long Head" },
          { name: "Lateral Head" },
          { name: "Medial Head" }
        ]
      },
      {
        name: "Forearms",
        subMuscles: [
          { name: "Wrist Flexors" },
          { name: "Wrist Extensors" }
        ]
      }
    ]
  },
  {
    name: "Legs",
    color: "#f97316", // orange
    muscles: [
      {
        name: "Quadriceps",
        subMuscles: [
          { name: "Rectus Femoris" },
          { name: "Vastus Lateralis" },
          { name: "Vastus Medialis" },
          { name: "Vastus Intermedius" }
        ]
      },
      {
        name: "Hamstrings",
        subMuscles: [
          { name: "Biceps Femoris" },
          { name: "Semitendinosus" },
          { name: "Semimembranosus" }
        ]
      },
      {
        name: "Glutes",
        subMuscles: [
          { name: "Gluteus Maximus" },
          { name: "Gluteus Medius" },
          { name: "Gluteus Minimus" }
        ]
      },
      {
        name: "Calves",
        subMuscles: [
          { name: "Gastrocnemius" },
          { name: "Soleus" }
        ]
      }
    ]
  },
  {
    name: "Core",
    color: "#a855f7", // purple
    muscles: [
      { name: "Rectus Abdominis" },
      { name: "Obliques (Internal & External)" },
      { name: "Transverse Abdominis" },
      { name: "Erector Spinae" }
    ]
  }
];

// Generate hierarchical tags for a specific muscle selection
export function generateMuscleTagsFromPath(
  groupName: string,
  muscleName: string,
  subMuscleName?: string,
  headName?: string
): ExerciseTag[] {
  const group = MUSCLE_GROUPS.find(g => g.name === groupName);
  if (!group) return [];

  const tags: ExerciseTag[] = [];
  const color = group.color;

  // Always add the main group tag
  tags.push({
    name: groupName,
    color,
    level: 'group'
  });

  // Add muscle tag
  tags.push({
    name: muscleName,
    color,
    level: 'muscle'
  });

  // Add sub-muscle tag if provided
  if (subMuscleName) {
    tags.push({
      name: subMuscleName,
      color,
      level: 'subMuscle'
    });
  }

  // Add head tag if provided
  if (headName) {
    const fullHeadName = subMuscleName ? `${subMuscleName} - ${headName}` : `${muscleName} - ${headName}`;
    tags.push({
      name: fullHeadName,
      color,
      level: 'head'
    });
  }

  return tags;
}

// Get all possible muscle selections for dropdowns/selectors
export function getAllMuscleSelections(): Array<{
  group: string;
  muscle: string;
  subMuscle?: string;
  head?: string;
  displayName: string;
  tags: ExerciseTag[];
}> {
  const selections: Array<{
    group: string;
    muscle: string;
    subMuscle?: string;
    head?: string;
    displayName: string;
    tags: ExerciseTag[];
  }> = [];

  MUSCLE_GROUPS.forEach(group => {
    group.muscles.forEach(muscle => {
      // If muscle has sub-muscles
      if (muscle.subMuscles) {
        muscle.subMuscles.forEach(subMuscle => {
          // If sub-muscle has heads
          if (subMuscle.heads) {
            subMuscle.heads.forEach(head => {
              const displayName = `${group.name} > ${muscle.name} > ${subMuscle.name} > ${head.name}`;
              const tags = generateMuscleTagsFromPath(group.name, muscle.name, subMuscle.name, head.name);
              selections.push({
                group: group.name,
                muscle: muscle.name,
                subMuscle: subMuscle.name,
                head: head.name,
                displayName,
                tags
              });
            });
          } else {
            // Sub-muscle without heads
            const displayName = `${group.name} > ${muscle.name} > ${subMuscle.name}`;
            const tags = generateMuscleTagsFromPath(group.name, muscle.name, subMuscle.name);
            selections.push({
              group: group.name,
              muscle: muscle.name,
              subMuscle: subMuscle.name,
              displayName,
              tags
            });
          }
        });
      }
      // If muscle has heads (but no sub-muscles)
      else if (muscle.heads) {
        muscle.heads.forEach(head => {
          const displayName = `${group.name} > ${muscle.name} > ${head.name}`;
          const tags = generateMuscleTagsFromPath(group.name, muscle.name, undefined, head.name);
          selections.push({
            group: group.name,
            muscle: muscle.name,
            head: head.name,
            displayName,
            tags
          });
        });
      }
      // Muscle without heads or sub-muscles
      else {
        const displayName = `${group.name} > ${muscle.name}`;
        const tags = generateMuscleTagsFromPath(group.name, muscle.name);
        selections.push({
          group: group.name,
          muscle: muscle.name,
          displayName,
          tags
        });
      }
    });
  });

  return selections;
}

// Helper function to get color for a muscle group
export function getMuscleGroupColor(groupName: string): string {
  const group = MUSCLE_GROUPS.find(g => g.name === groupName);
  return group?.color || '#6b7280'; // default gray
}