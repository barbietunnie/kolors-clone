'use client';

import { getAllBlindnessSimulations } from '@/lib/colors';
import { getContrastingTextColor } from '@/lib/colors';

interface BlindnessSimulatorProps {
  hex: string;
}

export function BlindnessSimulator({ hex }: BlindnessSimulatorProps) {
  const simulations = getAllBlindnessSimulations(hex);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Blindness Simulation</h2>
      <p className="text-sm text-gray-500 mb-4">
        See how this color appears to people with different types of color vision deficiency.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Original color */}
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: hex }}
            />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Original</h3>
              <p className="text-xs text-gray-500">Normal vision</p>
            </div>
          </div>
        </div>

        {simulations.map((sim) => (
          <div key={sim.type} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-mono"
                style={{
                  backgroundColor: sim.simulatedColor,
                  color: getContrastingTextColor(sim.simulatedColor),
                }}
              >
                {sim.simulatedColor}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">{sim.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{sim.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
