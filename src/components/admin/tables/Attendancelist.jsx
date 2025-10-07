import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const SiteAttendanceList = ({ data, loading, onEdit, onDelete }) => {
  // Helper function to determine the display status
  const getDisplayStatus = (attendances) => {
    if (!Array.isArray(attendances) || attendances.length === 0) {
      return 'N/A';
    }
    const statuses = attendances.map(a => a.status || 'N/A');
    const uniqueStatuses = [...new Set(statuses)];
    if (uniqueStatuses.length === 1) {
      return uniqueStatuses[0]; // All statuses are the same, return that status
    }
    return 'Mixed'; // Different statuses, show "Mixed"
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">#</th>
            <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Staff Names</th>
            <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Date</th>
            <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Status</th>
            <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Remarks</th>
            <th className="px-6 py-3 text-xs font-medium text-center text-gray-700 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading...</td>
            </tr>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id || index}>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {Array.isArray(item.attendances)
                    ? item.attendances.map(a => a.staff?.name || 'N/A').join(', ')
                    : 'N/A'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.date
                    ? new Date(item.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    : 'N/A'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {getDisplayStatus(item.attendances)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {Array.isArray(item.attendances)
                    ? item.attendances.map(a => a.remarks || '-').join(', ')
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 space-x-2 text-sm font-medium text-center whitespace-nowrap">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                    aria-label="Edit Attendance"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete Attendance"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No attendance records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SiteAttendanceList;