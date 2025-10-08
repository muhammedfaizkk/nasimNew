import React from 'react';
import {
    FiPlus,
    FiSearch,
    FiAlertCircle,
    FiFileText,
    FiUser,
    FiCalendar,
    FiEdit,
    FiTrash2,
    FiDownload
} from 'react-icons/fi';
import handleDownload from './HandleDownloadpdf';

const InvoiceTable = ({
    invoices,
    loading,
    error,
    searchTerm,
    onSearchChange,
    onEdit,
    onDelete,
    onNewInvoice,
    deleteLoading,
    page = 1,
    totalPages = 1,
    onPageChange = () => {}
}) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="p-8 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
                            <button
                                onClick={onNewInvoice}
                                className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                <FiPlus size={20} />
                                New Invoice
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <div className="relative flex-1 max-w-md">
                                <FiSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 mx-8 mt-4 border border-red-200 rounded-lg bg-red-50">
                            <FiAlertCircle className="text-red-500" size={20} />
                            <span className="text-red-700">{error.message}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Bill To
                                        </th>
                                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Due Date
                                        </th>
                                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiFileText className="mr-3 text-gray-400" size={16} />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {invoice.invoiceNo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiUser className="mr-3 text-gray-400" size={16} />
                                                    <span className="text-sm text-gray-900">{invoice.billTo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiCalendar className="mr-3 text-gray-400" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiCalendar className="mr-3 text-gray-400" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        ₹{invoice.subtotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => onEdit(invoice)}
                                                        className="p-1 text-blue-600 transition-colors rounded hover:text-blue-900"
                                                    >
                                                        <FiEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(invoice._id)}
                                                        disabled={deleteLoading}
                                                        className="p-1 text-red-600 transition-colors rounded hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(invoice)}
                                                        className="p-1 text-green-600 transition-colors rounded hover:text-green-900"
                                                    >
                                                        <FiDownload size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center my-6 space-x-1">
                                    <button
                                        onClick={() => onPageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => onPageChange(pageNum)}
                                                className={`px-3 py-1 border rounded ${page === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => onPageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {invoices.length === 0 && (
                                <div className="py-12 text-center">
                                    <FiFileText className="mx-auto mb-4 text-gray-400" size={48} />
                                    <p className="text-gray-500">No invoices found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
