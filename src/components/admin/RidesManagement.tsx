import React, { useState } from 'react';
import { Search, Filter, MapPin, Download, FileText, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Ride {
  id: number;
  customer: string;
  driver: string;
  pickup: string;
  dropoff: string;
  status: 'completed' | 'cancelled' | 'in-progress';
  amount: string;
  date: string;
}

export function RidesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const rides: Ride[] = [
    {
      id: 1,
      customer: 'Alice Johnson',
      driver: 'John Doe',
      pickup: '23 Rue de la Gare, Luxembourg',
      dropoff: '45 Avenue JF Kennedy, Luxembourg',
      status: 'completed',
      amount: '€25.50',
      date: '2024-03-15',
    },
    {
      id: 2,
      customer: 'Bob Smith',
      driver: 'Sarah Wilson',
      pickup: '12 Boulevard Royal, Luxembourg',
      dropoff: '78 Route d\'Esch, Luxembourg',
      status: 'completed',
      amount: '€18.75',
      date: '2024-03-15',
    },
    {
      id: 3,
      customer: 'Carol Davis',
      driver: 'Mike Brown',
      pickup: '34 Avenue de la Liberté, Luxembourg',
      dropoff: '56 Rue de Hollerich, Luxembourg',
      status: 'in-progress',
      amount: '€32.00',
      date: '2024-03-15',
    },
  ];

  const filteredRides = rides.filter(ride =>
    ride.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.dropoff.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = ['Date', 'Customer', 'Driver', 'Pickup', 'Dropoff', 'Status', 'Amount'];
      const csvContent = [
        headers.join(','),
        ...filteredRides.map(ride => [
          ride.date,
          ride.customer,
          ride.driver,
          ride.pickup,
          ride.dropoff,
          ride.status,
          ride.amount,
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rides-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    try {
      const doc = new jsPDF();

      // Add header
      doc.setFontSize(20);
      doc.text('CasaDrive Rides Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

      // Add statistics
      const totalRides = filteredRides.length;
      const completedRides = filteredRides.filter(r => r.status === 'completed').length;
      const totalRevenue = filteredRides
        .reduce((sum, ride) => sum + parseFloat(ride.amount.replace('€', '')), 0)
        .toFixed(2);

      doc.text('Summary:', 20, 45);
      doc.text(`Total Rides: ${totalRides}`, 30, 55);
      doc.text(`Completed Rides: ${completedRides}`, 30, 65);
      doc.text(`Total Revenue: €${totalRevenue}`, 30, 75);

      // Add rides table
      const tableData = filteredRides.map(ride => [
        ride.date,
        ride.customer,
        ride.driver,
        ride.status,
        ride.amount,
      ]);

      // @ts-ignore (jspdf-autotable types)
      doc.autoTable({
        startY: 90,
        head: [['Date', 'Customer', 'Driver', 'Status', 'Amount']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 133, 244] },
      });

      doc.save(`rides-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Rides Management</h2>
        <div className="flex space-x-4">
          <button 
            className="btn-secondary flex items-center"
            onClick={exportToCSV}
            disabled={isExporting}
          >
            <Download className="h-5 w-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </button>
          <button 
            className="btn-primary flex items-center"
            onClick={generateReport}
            disabled={isGeneratingReport}
          >
            <FileText className="h-5 w-5 mr-2" />
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  Ride Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRides.map((ride) => (
                <tr key={ride.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-gray-600">{ride.pickup}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-gray-600">{ride.dropoff}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {ride.date}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ride.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ride.driver}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ride.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : ride.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ride.amount}
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