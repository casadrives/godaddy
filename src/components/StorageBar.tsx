import React from 'react';
import { HardDrive } from 'lucide-react';

interface StorageBarProps {
  used: number;
  total: number;
}

interface StorageType {
  type: string;
  size: string;
  color: string;
  percentage: number;
}

const StorageBar: React.FC<StorageBarProps> = ({ used, total }) => {
  const storageTypes: StorageType[] = [
    { type: 'Documents', size: '25.5 GB', color: 'bg-blue-500', percentage: 30 },
    { type: 'Media', size: '32.8 GB', color: 'bg-purple-500', percentage: 40 },
    { type: 'Other', size: '17.2 GB', color: 'bg-gray-500', percentage: 20 },
  ];

  const percentage = Math.round((used / total) * 100);
  const usedGB = (used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (total / 1024 / 1024 / 1024).toFixed(1);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <HardDrive className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Storage Overview</h2>
        </div>
        <span className="text-sm text-gray-500">{usedGB}GB of {totalGB}GB used</span>
      </div>

      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
        {storageTypes.map((item, index) => (
          <div
            key={item.type}
            style={{ width: `${item.percentage}%` }}
            className={`h-full ${item.color} ${index > 0 ? '-mt-4' : ''}`}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {storageTypes.map((item) => (
          <div key={item.type} className="text-center">
            <div className={`h-3 w-3 rounded-full ${item.color} mx-auto mb-2`} />
            <p className="text-sm font-medium text-gray-900">{item.type}</p>
            <p className="text-sm text-gray-500">{item.size}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Storage Used</span>
          <span className="text-gray-900 font-medium">
            {usedGB}GB / {totalGB}GB
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{percentage}% used</span>
          <span>{((total - used) / 1024 / 1024 / 1024).toFixed(1)}GB free</span>
        </div>
      </div>
    </div>
  );
};

export default StorageBar;