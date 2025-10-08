import React, { useState } from 'react';
import AddWageIncrementForm from '../../../components/admin/forms/AddWageIncrementForm';

const StaffIncrementsTab = ({ staffId,incrementHistory, incrementLoading, incrementsThisMonth = [], currentWage, onEditWage, getPublicStaffById }) => {
  const [showForm, setShowForm] = useState(false);
  const [editIncrement, setEditIncrement] = useState(null);

  const safeIncrementHistory = Array.isArray(incrementHistory) ? incrementHistory : [];
  const safeIncrementsThisMonth = Array.isArray(incrementsThisMonth) ? incrementsThisMonth : [];

  const handleAddClick = () => {
    setEditIncrement(null);
    setShowForm(true);
  };

  const handleEditClick = (increment) => {
    setEditIncrement(increment);
    setShowForm(true);
  };

const handleFormSubmit = (wageData) => {
  setShowForm(false); // Close form immediately
  setEditIncrement(null);
  onEditWage(wageData); // Notify parent
};

  return (
    <div>
      <div className="flex items-center justify-between p-3 mb-4 p-sm-0">
        <h2 className="text-lg font-semibold">Wage History</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* This Month's Increments Section */}
      {safeIncrementsThisMonth.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-2 font-semibold text-md">This Month's Increments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Previous Wage</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">New Wage</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Increment Amount</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Notes</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {safeIncrementsThisMonth.map((increment, index) => (
                  <tr key={increment._id || increment.id || index}>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(increment.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ₹{increment.previousWage.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ₹{increment.newWage.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ₹{increment.incrementAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {increment.reason || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(increment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {incrementLoading ? (
        <div className="flex items-center justify-center py-8">
          <svg
            className="w-6 h-6 mr-2 text-blue-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Loading increment history...</span>
        </div>
      ) : safeIncrementHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Previous Wage</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">New Wage</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Increment Amount</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Notes</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeIncrementHistory.map((increment, index) => (
                <tr key={increment._id || index}>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(increment.effectiveDate || increment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    ₹{increment.previousWage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    ₹{increment.newWage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    ₹{(increment.incrementAmount !== undefined ? increment.incrementAmount : (increment.newWage - increment.previousWage)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {increment.reason || increment.notes || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(increment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No wage increment history found for this staff member.
        </div>
      )}

      {showForm && (
        <AddWageIncrementForm
          staffId={staffId}
          currentWage={currentWage}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          mode={editIncrement ? 'edit' : 'add'}
          incrementData={editIncrement}
          getPublicStaffById={getPublicStaffById}
        />
      )}
    </div>
  );
};

export default StaffIncrementsTab;