import React, { useState } from 'react';
import { Driver, Document } from '../../types/driver';

interface DocumentVerificationProps {
  driver: Driver;
  onVerify: (documentKey: string, verified: boolean) => void;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({ driver, onVerify }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  const getDocumentStatus = (verified: boolean) => {
    if (verified) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Verified
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const handleVerify = (documentKey: string, verified: boolean) => {
    onVerify(documentKey, verified);
    setNotes('');
    setSelectedDocument(null);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Document List */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Verification</h3>
        <div className="space-y-4">
          {Object.entries(driver.documents).map(([key, doc]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border ${
                selectedDocument === key
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-gray-200'
              } hover:border-indigo-500 transition-colors cursor-pointer`}
              onClick={() => setSelectedDocument(key)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500">{doc.number}</p>
                </div>
                {getDocumentStatus(doc.verified)}
              </div>

              {/* Document Preview */}
              {selectedDocument === key && (
                <div className="mt-4 space-y-4">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
                    {/* Document preview would go here */}
                    <div className="flex items-center justify-center text-gray-500">
                      Document Preview
                    </div>
                  </div>

                  {/* Verification Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Verification Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about the document verification..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleVerify(key, false)}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(key, true)}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verification Progress */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Verification Progress
            </p>
            <p className="text-sm text-gray-500">
              {Object.values(driver.documents).filter((doc) => doc.verified).length} of{' '}
              {Object.values(driver.documents).length} documents verified
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-48 h-2 bg-gray-200 rounded-full mr-2">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{
                  width: `${
                    (Object.values(driver.documents).filter((doc) => doc.verified).length /
                      Object.values(driver.documents).length) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(
                (Object.values(driver.documents).filter((doc) => doc.verified).length /
                  Object.values(driver.documents).length) *
                  100
              )}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;
