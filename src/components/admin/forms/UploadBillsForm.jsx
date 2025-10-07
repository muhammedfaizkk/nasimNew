import React, { useState } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const BillsUploadingForm = ({ onSave, onClose, loading: propLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.file) {
      toast.error('Please provide bill title and upload an image');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('file', formData.file);

      await onSave(data);
    } catch (err) {
      toast.error(err.message || 'Failed to upload bill');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            Bills Uploading
          </h2>
          <button onClick={onClose} disabled={propLoading}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bill Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Bill Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter bill title"
              required
              disabled={propLoading}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Bill Image *</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              required
              disabled={propLoading}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              disabled={propLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {propLoading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={propLoading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillsUploadingForm;
