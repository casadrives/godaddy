import React, { useState } from 'react';
import { Driver, DriverStatus } from '../../types/driver';

interface DriverActionsProps {
  selectedDrivers: Driver[];
  onBatchStatusChange: (status: DriverStatus) => void;
  onExportData: (format: 'csv' | 'json') => void;
  onClearSelection: () => void;
}

const DriverActions: React.FC<DriverActionsProps> = ({
  selectedDrivers,
  onBatchStatusChange,
  onExportData,
  onClearSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    onExportData(format);
  };

  if (selectedDrivers.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">
                  {selectedDrivers.length} selected
                </span>
                <span className="hidden md:inline">
                  {selectedDrivers.length} drivers selected
                </span>
              </p>
            </div>
            <div className="flex-shrink-0 w-full flex items-center justify-end mt-2 sm:mt-0 sm:w-auto gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onBatchStatusChange('ACTIVE')}
                  className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Activate All
                </button>
                <button
                  onClick={() => onBatchStatusChange('SUSPENDED')}
                  className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Suspend All
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Export
                  </button>
                  {isOpen && (
                    <div className="origin-top-right absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => handleExport('csv')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => handleExport('json')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export as JSON
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClearSelection}
                  className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverActions;
