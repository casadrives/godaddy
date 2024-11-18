import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { DriverRegistration } from '../../services/adminService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverRegistration) => Promise<void>;
}

export function DriverRegistrationModal({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<Partial<DriverRegistration>>({
    vehicleInfo: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      plateNumber: '',
      class: 'economy'
    },
    documents: {
      driverLicense: null,
      vehicleRegistration: null,
      insurance: null,
      backgroundCheck: null,
      profilePhoto: null
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData as DriverRegistration);
      onClose();
    } catch (error) {
      // Error handling is managed by the parent component
    }
  };

  const handleFileUpload = (docType: keyof DriverRegistration['documents']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: file
        }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">CasaDrives Driver Registration</h2>
            <p className="text-gray-600 mt-1">Register a new driver for the CasaDrives platform</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.name || ''}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border rounded p-2"
                  value={formData.email || ''}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full border rounded p-2"
                  value={formData.phone || ''}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">License Number</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.licenseNumber || ''}
                  onChange={e => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Make</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.vehicleInfo?.make || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo!, make: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Model</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.vehicleInfo?.model || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo!, model: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Year</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={formData.vehicleInfo?.year || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo!, year: parseInt(e.target.value) }
                  }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Plate Number</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.vehicleInfo?.plateNumber || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo!, plateNumber: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Vehicle Class</label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.vehicleInfo?.class || 'economy'}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    vehicleInfo: { ...prev.vehicleInfo!, class: e.target.value as any }
                  }))}
                  required
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                  <option value="ambulance">Ambulance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData.documents || {}).map(docType => (
                <div key={docType} className="mb-4">
                  <label className="block mb-2 capitalize">{docType.replace(/([A-Z])/g, ' $1')}</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      className="hidden"
                      id={`file-${docType}`}
                      onChange={handleFileUpload(docType as keyof DriverRegistration['documents'])}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor={`file-${docType}`}
                      className="flex items-center space-x-2 cursor-pointer bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                    >
                      <Upload size={20} />
                      <span>{formData.documents?.[docType as keyof DriverRegistration['documents']] ? 'Change File' : 'Upload File'}</span>
                    </label>
                    {formData.documents?.[docType as keyof DriverRegistration['documents']] && (
                      <span className="text-sm text-green-600">✓ Uploaded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
