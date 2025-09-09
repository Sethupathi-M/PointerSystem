"use client";
import { Header } from "./Header";

// Demo component to show how the leveling system works
export const LevelingDemo = () => {
  const examples = [
    { name: "Beginner", requiredPoints: 1000, gainedPoints: 500 },
    { name: "Level 2 Ready", requiredPoints: 1000, gainedPoints: 1000 },
    { name: "Level 2", requiredPoints: 1000, gainedPoints: 1300 },
    { name: "Level 3", requiredPoints: 1000, gainedPoints: 2001 },
    { name: "Level 4", requiredPoints: 1000, gainedPoints: 3500 },
  ];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold text-white mb-4">Leveling System Demo</h2>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <div key={index} className="border border-slate-600 rounded-lg p-2">
            <div className="text-sm text-slate-300 mb-2">
              <strong>{example.name}:</strong> {example.gainedPoints} points / {example.requiredPoints} required
            </div>
            <Header
              name={example.name}
              requiredPoints={example.requiredPoints}
              gainedPoints={example.gainedPoints}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
