import React, { useState } from 'react';
import { Search, Filter, Building, Car, Users, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  taxiLicense: string;
  status: 'pending' | 'approved' | 'rejected';
  fleetSize: number;
  activeDrivers: number;
  joinDate: string;
  lastActive: string;
  vehicleClasses: {
    first: number;
    business: number;
    economy: number;
    ambulance: number;
  };
}

export function CompanyPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { formatAmount } = useApp();

  // Mock company data
  const companies: Company[] = [
    {
      id: '1',
      name: 'LuxTaxi Services',
      email: 'contact@luxtaxi.lu',
      phone: '+352 123 456 789',
      registrationNumber: 'LUX2024001',
      taxiLicense: 'TX-2024-001',
      status: 'approved',
      fleetSize: 25,
      activeDrivers: 20,
      joinDate: '2024-01-15',
      lastActive: '2024-03-15',
      vehicleClasses: {
        first: 5,
        business: 10,
        economy: 8,
        ambulance: 2
      }
    },
    {
      id: '2',
      name: 'City Cabs Luxembourg',
      email: 'info@citycabs.lu',
      phone: '+352 234 567 890',
      registrationNumber: 'LUX2024002',
      taxiLicense: 'TX-2024-002',
      status: 'pending',
      fleetSize: 15,
      activeDrivers: 0,
      joinDate: '2024-03-10',
      lastActive: '2024-03-10',
      vehicleClasses: {
        first: 3,
        business: 7,
        economy: 5,
        ambulance: 0
      }
    }
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (companyId: string, status: 'approved' | 'rejected') => {
    // In production, make API call to update status
    console.log(`Updating company ${companyId} status to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Company Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button className="btn-secondary flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fleet Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  License Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {company.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {company.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {company.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Car className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{company.fleetSize} vehicles</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{company.activeDrivers} active drivers</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Since {new Date(company.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Reg:</span> {company.registrationNumber}</p>
                      <p><span className="text-gray-500">License:</span> {company.taxiLicense}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      company.status === 'approved' ? 'bg-green-100 text-green-800' :
                      company.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(company.id, 'rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(company.id, 'approved')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{selectedCompany.name}</h3>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Company Info */}
              <div>
                <h4 className="font-medium mb-4">Company Information</h4>
                <div className="space-y-3">
                  <p><span className="text-gray-500">Email:</span> {selectedCompany.email}</p>
                  <p><span className="text-gray-500">Phone:</span> {selectedCompany.phone}</p>
                  <p><span className="text-gray-500">Registration:</span> {selectedCompany.registrationNumber}</p>
                  <p><span className="text-gray-500">License:</span> {selectedCompany.taxiLicense}</p>
                  <p><span className="text-gray-500">Member Since:</span> {new Date(selectedCompany.joinDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Fleet Info */}
              <div>
                <h4 className="font-medium mb-4">Fleet Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>First Class</span>
                    <span className="font-medium">{selectedCompany.vehicleClasses.first}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Business Class</span>
                    <span className="font-medium">{selectedCompany.vehicleClasses.business}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Economy Class</span>
                    <span className="font-medium">{selectedCompany.vehicleClasses.economy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ambulance</span>
                    <span className="font-medium">{selectedCompany.vehicleClasses.ambulance}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Fleet Size</span>
                      <span>{selectedCompany.fleetSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t flex justify-end space-x-4">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              {selectedCompany.status === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate(selectedCompany.id, 'rejected')}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Suspend Company
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}