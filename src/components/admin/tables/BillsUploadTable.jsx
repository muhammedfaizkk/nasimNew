import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Download, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import BillsUploadingForm from '../forms/UploadBillsForm';
import ConfirmationModal from '../../admin/ConfirmationModal';

// ✅ import hooks
import {
    useAddBill,
    useGetAllBills,
    useUpdateBill,
    useDeleteBill,
} from '../../../hooks/sitebills/Sitebillhooks';

export default function BillsUploadTable({ siteId }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    // popup state
    const [popupBill, setPopupBill] = useState(null);

    const { addBill, loading: isAdding } = useAddBill();
    const { getAllBills, bills, loading: isFetching } = useGetAllBills();
    const { updateBill, loading: isUpdating } = useUpdateBill();
    const { deleteBill, loading: isDeleting } = useDeleteBill();

    // ✅ Fetch bills when siteId changes
    useEffect(() => {
        if (siteId) getAllBills(siteId);
    }, [siteId]);

    const handleDeleteClick = (billId) => {
        setSelectedBillId(billId);
        setConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedBillId) return;
        const success = await deleteBill(selectedBillId);
        if (success) {
            toast.success('Bill deleted successfully');
            getAllBills(siteId);
        } else {
            toast.error('Failed to delete bill');
        }
        setConfirmModalOpen(false);
        setSelectedBillId(null);
    };

    const resetForm = () => setShowForm(false);

    // ✅ Create or Update
    const handleFormSubmit = async (formData, editingId = null) => {
        let success = false;
        if (editingId) {
            const res = await updateBill(editingId, formData);
            success = !!res;
            if (success) toast.success('Bill updated successfully');
        } else {
            const res = await addBill(siteId, formData);
            success = !!res;
            if (success) toast.success('Bill uploaded successfully');
        }

        if (success) {
            resetForm();
            getAllBills(siteId);
        } else {
            toast.error('Failed to save bill');
        }
    };

    // ✅ download handler
    const handleDownload = (url, title) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = title || 'bill';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-green-600" />
                    Bills Upload
                </h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Upload</span>
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <BillsUploadingForm
                    onSave={handleFormSubmit}
                    onClose={resetForm}
                    loading={isAdding || isUpdating}
                />
            )}

            {/* Bills List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isFetching ? (
                    <p className="text-gray-500">Loading bills...</p>
                ) : bills.length === 0 ? (
                    <p className="text-gray-500">No bills uploaded yet.</p>
                ) : (
                    bills.map((bill) => (
                        <div
                            key={bill._id}
                            className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                            onClick={() => setPopupBill(bill)} // ✅ open popup
                        >
                            <h4 className="font-medium mb-2">{bill.title}</h4>
                            {bill.url && (
                                <img
                                    src={bill.url}
                                    alt={bill.title}
                                    className="w-40 h-40 object-cover rounded mb-3"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                actionType="delete"
                itemName={selectedBillId ? 'Bill record' : ''}
                loading={isDeleting}
            />

            {/* ✅ Popup Modal for options */}
            {popupBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h4 className="font-semibold mb-4">{popupBill.title}</h4>
                        {popupBill.url && (
                            <img
                                src={popupBill.url}
                                alt={popupBill.title}
                                className="w-full h-60 object-cover rounded mb-4"
                            />
                        )}

                        <div className="flex justify-between space-x-3">
                            <button
                                onClick={() => window.open(popupBill.url, '_blank')}
                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            <button
                                onClick={() => handleDownload(popupBill.url, popupBill.title)}
                                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Download className="w-4 h-4 mr-1" /> Download
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteClick(popupBill._id);
                                    setPopupBill(null);
                                }}
                                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                        </div>

                        <button
                            onClick={() => setPopupBill(null)}
                            className="mt-4 text-gray-500 hover:text-gray-700 block mx-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
