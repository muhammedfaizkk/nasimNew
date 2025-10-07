import { useState } from "react";
import axiosInstance from "../api";

// ✅ Add Bill
export const useAddBill = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bill, setBill] = useState(null);
    const [success, setSuccess] = useState(false);

    const addBill = async (siteId, billData) => {
        if (!siteId) {
            setError({ message: "Site ID is required" });
            return null;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await axiosInstance.post(`/bills/${siteId}`, billData, {
                headers: { "Content-Type": "multipart/form-data" }, // image upload
            });

            if (res.data.success) {
                setBill(res.data.bill);
                setSuccess(true);
                return res.data.bill;
            } else {
                setError({ message: res.data.message || "Failed to upload bill" });
                return null;
            }
        } catch (err) {
            setError({
                message: "Failed to upload bill",
                details: err.response?.data?.message || err.message,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
        setBill(null);
    };

    return { addBill, loading, error, bill, success, reset };
};

// ✅ Get All Bills
export const useGetAllBills = () => {
    const [loading, setLoading] = useState(false);
    const [bills, setBills] = useState([]);
    const [error, setError] = useState(null);

    const getAllBills = async (siteId) => {
        if (!siteId) {
            setError({ message: "Site ID is required" });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get(`/bills/${siteId}`);
            if (res.data.success) {
                setBills(res.data.images || []);
            } else {
                setError({ message: res.data.message || "Failed to fetch bills" });
            }
        } catch (err) {
            setError({
                message: "Failed to fetch bills",
                details: err.response?.data?.message || err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return { getAllBills, bills, loading, error };
};

// ✅ Update Bill
export const useUpdateBill = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateBill = async (billId, billData) => {
        if (!billId) {
            setError({ message: "Bill ID is required" });
            return null;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await axiosInstance.put(`/bills/${billId}`, billData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                setSuccess(true);
                return res.data.bill;
            } else {
                setError({ message: res.data.message || "Failed to update bill" });
                return null;
            }
        } catch (err) {
            setError({
                message: "Failed to update bill",
                details: err.response?.data?.message || err.message,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return { updateBill, loading, error, success, reset };
};

// ✅ Delete Bill
export const useDeleteBill = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteBill = async (billId) => {
        if (!billId) {
            setError({ message: "Bill ID is required" });
            return false;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await axiosInstance.delete(`/bills/${billId}`);
            if (res.data.success) {
                setSuccess(true);
                return true;
            } else {
                setError({ message: res.data.message || "Failed to delete bill" });
                return false;
            }
        } catch (err) {
            setError({
                message: "Failed to delete bill",
                details: err.response?.data?.message || err.message,
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return { deleteBill, loading, error, success, reset };
};
