import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, DollarSign, Ban, CheckCircle, Mail } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  rides: number;
  rating: number;
  vehicle: string;
  earnings: number;
  commission: number;
}

interface ActionMenuProps {
  driver: Driver;
  onClose: () => void;
  onAction: (action: string, driver: Driver) => void;
}

function ActionMenu({ driver, onClose, onAction }: ActionMenuProps) {
  const actions = [
    {
      label: 'Send Message',
      icon: Mail,
      action: 'message',
      className: 'text-blue-600 hover:bg-blue-50'
    },
    {
      label: driver.status === 'active' ? 'Block Driver' : 'Unblock Driver',
      icon: driver.status === 'active' ? Ban : CheckCircle,
      action: 'toggle-status',
      className: driver.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
    },
    {
      label: 'View Commission',
      icon: DollarSign,
      action: 'commission',
      className: 'text-gray-600 hover:bg-gray-50'
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu">
        {actions.map((action) => (
          <button
            key={action.action}
            onClick={() => {
              onAction(action.action, driver);
              onClose();
            }}
            className={`w-full px-4 py-2 text-sm flex items-center ${action.className}`}
            role="menuitem"
          >
            <action.icon className="h-4 w-4 mr-2" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DriversManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  
  const drivers: Driver[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+352 123 456 789',
      status: 'active',
      rides: 145,
      rating: 4.8,
      vehicle: 'Toyota Camry 2022',
      earnings: 2450,
      commission: 85,
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+352 234 567 890',
      status: 'inactive',
      rides: 89,
      rating: 4.6,
      vehicle: 'Honda Accord 2021',
      earnings: 1890,
      commission: 85,
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+352 345 678 901',
      status: 'active',
      rides: 234,
      rating: 4.9,
      vehicle: 'Tesla Model 3 2023',
      earnings: 3560,
      commission: 85,
    },
  ];

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action: string, driver: Driver) => {
    switch (action) {
      case 'message':
        // Implement message functionality
        console.log('Sending message to:', driver.name);
        break;
      case 'toggle-status':
        // Implement status toggle
        console.log('Toggling status for:', driver.name);
        break;
      case 'commission':
        // Implement commission view
        console.log('Viewing commission for:', driver.name);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Drivers Management</h2>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add New Driver
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search drivers..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <button className="btn-secondary flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Earnings & Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {driver.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.name}
                        </div>
                        <div className="text-sm text-gray-500">{driver.email}</div>
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{driver.vehicle}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      driver.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.rides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {driver.rating}
                      </span>
                      <span className="ml-1 text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        €{driver.earnings.toFixed(2)}
                      </div>
                      <div className="text-green-600">
                        {driver.commission}% commission
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setActiveActionMenu(activeActionMenu === driver.id ? null : driver.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeActionMenu === driver.id && (
                        <ActionMenu
                          driver={driver}
                          onClose={() => setActiveActionMenu(null)}
                          onAction={handleAction}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}