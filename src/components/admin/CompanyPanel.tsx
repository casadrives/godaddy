import React, { useState, useEffect } from 'react';
import { Search, Filter, Building, Car, Users, Clock, Check, X, AlertTriangle, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { adminService, CompanyRegistration, CompanyUpdateStatus } from '../../services/adminService';
import toast from 'react-hot-toast';

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { formatAmount } = useApp();

  const [registrationData, setRegistrationData] = useState<Partial<CompanyRegistration>>({
    vehicleClasses: { first: 0, business: 0, economy: 0, ambulance: 0 },
    documents: { businessLicense: null, taxiPermit: null, insurance: null }
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCompanyList({ search: searchTerm });
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await adminService.registerCompany(registrationData as CompanyRegistration);
      toast.success('Company registration submitted successfully');
      setShowRegistrationForm(false);
      loadCompanies();
    } catch (error) {
      toast.error('Failed to register company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (companyId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      setIsLoading(true);
      await adminService.updateCompanyStatus({ companyId, status, reason });
      toast.success(`Company ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      loadCompanies();
    } catch (error) {
      toast.error('Failed to update company status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (docType: keyof CompanyRegistration['documents']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRegistrationData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: file
        }
      }));
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Register New Company
          </button>
        </div>
      </div>

      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Register New Company</h2>
            <form onSubmit={handleRegistrationSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={registrationData.name || ''}
                    onChange={e => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded p-2"
                    value={registrationData.email || ''}
                    onChange={e => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full border rounded p-2"
                    value={registrationData.phone || ''}
                    onChange={e => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Registration Number</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={registrationData.registrationNumber || ''}
                    onChange={e => setRegistrationData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Taxi License</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={registrationData.taxiLicense || ''}
                    onChange={e => setRegistrationData(prev => ({ ...prev, taxiLicense: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Fleet Size</label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    value={registrationData.fleetSize || ''}
                    onChange={e => setRegistrationData(prev => ({ ...prev, fleetSize: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Vehicle Classes</h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.keys(registrationData.vehicleClasses || {}).map(classType => (
                  <div key={classType}>
                    <label className="block mb-2 capitalize">{classType}</label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      value={registrationData.vehicleClasses?.[classType] || 0}
                      onChange={e => setRegistrationData(prev => ({
                        ...prev,
                        vehicleClasses: {
                          ...prev.vehicleClasses,
                          [classType]: parseInt(e.target.value)
                        }
                      }))}
                      min="0"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Required Documents</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(registrationData.documents || {}).map(docType => (
                  <div key={docType}>
                    <label className="block mb-2 capitalize">{docType.replace(/([A-Z])/g, ' $1')}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        className="hidden"
                        id={`file-${docType}`}
                        onChange={handleFileUpload(docType as keyof CompanyRegistration['documents'])}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor={`file-${docType}`}
                        className="flex items-center space-x-2 cursor-pointer bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                      >
                        <Upload size={20} />
                        <span>{registrationData.documents?.[docType] ? 'Change File' : 'Upload File'}</span>
                      </label>
                      {registrationData.documents?.[docType] && (
                        <span className="text-sm text-green-600">✓ Uploaded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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