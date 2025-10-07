import React, { useState, useEffect } from 'react';
import { Save, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetAllStaff } from '../../../hooks/staff/Addstaffhooks';

const SiteAttendanceForm = ({ siteId, attendance, onSave, onClose, loading: propLoading }) => {
  const { staff = [], getAllStaff, loading: staffLoading } = useGetAllStaff();

  const [formData, setFormData] = useState({
    attendances: [],
    date: '',
  });

  const statusOptions = ['Present', 'Absent'];

  useEffect(() => {
    // Fetch staff specific to the site
    getAllStaff({ siteId }); // Pass siteId to filter staff

    // Set today's date as default or load existing attendance
    const today = new Date().toISOString().split('T')[0];
    if (attendance) {
      setFormData({
        date: new Date(attendance.date).toISOString().split('T')[0],
        attendances: attendance.attendances.map(a => ({
          staffId: a.staff._id,
          status: a.status,
          remarks: a.remarks || ''
        }))
      });
    } else {
      setFormData({ date: today, attendances: [] });
    }
  }, [getAllStaff, attendance, siteId]);

  const handleStaffToggle = (staffId) => {
    setFormData((prev) => {
      const isSelected = prev.attendances.some(a => a.staffId === staffId);
      let updatedAttendances;
      if (isSelected) {
        updatedAttendances = prev.attendances.filter(a => a.staffId !== staffId);
      } else {
        updatedAttendances = [
          ...prev.attendances,
          { staffId, status: 'Present', remarks: '' }
        ];
      }
      return { ...prev, attendances: updatedAttendances };
    });
  };

  const handleStatusChange = (index, status) => {
    const updated = [...formData.attendances];
    updated[index].status = status;
    setFormData({ ...formData, attendances: updated });
  };

  const handleRemarksChange = (index, remarks) => {
    const updated = [...formData.attendances];
    updated[index].remarks = remarks;
    setFormData({ ...formData, attendances: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || formData.attendances.length === 0) {
      toast.error('Select date and at least one staff member');
      return;
    }

    try {
      await onSave({
        date: formData.date,
        attendances: formData.attendances,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to mark attendance');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mark Site Attendance</h2>
          <button onClick={onClose} disabled={propLoading}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={propLoading}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Staff Checkbox List */}
          <div>
            <label className="block mb-1 text-sm font-medium">Select Staff *</label>
            {staffLoading ? (
              <div className="flex items-center justify-center w-full h-32 px-3 py-2 border rounded-lg">
                Loading staff...
              </div>
            ) : (
              <div className="w-full h-32 overflow-y-auto border rounded-lg">
                {staff?.map((staff) => {
                  const isSelected = formData.attendances.some(a => a.staffId === staff._id);
                  return (
                    <div
                      key={staff._id}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleStaffToggle(staff._id)}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mr-2 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`}
                      />
                      <span className="text-sm">{staff.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Status and Remarks per staff */}
          {formData.attendances.map((entry, index) => {
            const staffName = staff?.find((s) => s._id === entry.staffId)?.name || 'Staff';
            return (
              <div key={entry.staffId} className="p-3 mt-2 border rounded-md bg-gray-50">
                <p className="mb-2 font-medium">{staffName}</p>
                <div className="flex items-center space-x-3">
                  <select
                    value={entry.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className="px-2 py-1 border rounded"
                    disabled={propLoading}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={entry.remarks}
                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                    disabled={propLoading}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex pt-4 space-x-3">
            <button
              type="submit"
              className="flex items-center justify-center flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={propLoading || staffLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {propLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={propLoading}
              className="flex-1 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteAttendanceForm;