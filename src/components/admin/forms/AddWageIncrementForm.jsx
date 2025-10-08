import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAddWageIncrement, useEditWageIncrement } from "../../../hooks/staff/Addstaffhooks";

const AddWageIncrementForm = ({
  staffId,
  currentWage,
  onClose,
  onSubmit,
  mode = "add",
  incrementData,
  getPublicStaffById,
}) => {
  const [formData, setFormData] = useState({
    newWage: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    reason: "",
    approvedBy: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  const { loading: addLoading, error: addError, addWageIncrement } = useAddWageIncrement();
  const { loading: editLoading, error: editError, editWageIncrement } = useEditWageIncrement();

  useEffect(() => {
    if (mode === "edit" && incrementData) {
      setFormData({
        newWage: Number(incrementData.newWage).toFixed(2),
        effectiveDate: incrementData.effectiveDate
          ? new Date(incrementData.effectiveDate).toISOString().split("T")[0]
          : "",
        reason: incrementData.reason || "",
        approvedBy: incrementData.approvedBy || "",
        notes: incrementData.notes || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        newWage: "", // Reset newWage for add mode
      }));
    }
  }, [mode, incrementData, currentWage]);

  const calculateIncrement = () => {
    const newWage = parseFloat(formData.newWage) || 0;
    const oldWage = parseFloat(currentWage) || 0;
    if (newWage && oldWage) {
      const incrementAmount = Number((newWage - oldWage).toFixed(2));
      const incrementPercentage = Number(((incrementAmount / oldWage) * 100).toFixed(2));
      return { incrementAmount, incrementPercentage };
    }
    return { incrementAmount: 0, incrementPercentage: 0 };
  };

  const { incrementAmount, incrementPercentage } = calculateIncrement();

  const validateForm = () => {
    const newErrors = {};
    if (!staffId || typeof staffId !== "string" || staffId.trim() === "") {
      newErrors.staffId = "Valid Staff ID is required";
    }
    if (!formData.newWage || parseFloat(formData.newWage) <= 0) {
      newErrors.newWage = "Valid new wage is required";
    } else if (parseFloat(formData.newWage) <= parseFloat(currentWage)) {
      newErrors.newWage = "New wage must be greater than current wage";
    }
    if (!formData.effectiveDate) {
      newErrors.effectiveDate = "Effective date is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    setSubmitError(null);

    if (!staffId || typeof staffId !== "string" || staffId.trim() === "") {
      setSubmitError("Staff ID is invalid or not available. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (validateForm()) {
      const payload = {
        newWage: Number(parseFloat(formData.newWage).toFixed(2)),
        effectiveDate: formData.effectiveDate,
        reason: formData.reason,
        approvedBy: formData.approvedBy || undefined,
        notes: formData.notes || undefined,
      };
      let result;
      if (mode === "edit") {
        result = await editWageIncrement(staffId, incrementData._id, payload);
      } else {
        payload.previousWage = Number(parseFloat(currentWage).toFixed(2));
        payload.incrementAmount = Number(incrementAmount.toFixed(2));
        payload.incrementPercentage = Number(incrementPercentage.toFixed(2));
        result = await addWageIncrement(staffId, payload);
      }
      if (result.success) {
        await getPublicStaffById(staffId); // Refresh staff data
        onSubmit(payload); // Notify parent
        onClose(); // Close form after success
      } else {
        setSubmitError(
          (mode === "edit" ? editError : addError)?.message ||
            `Failed to ${mode} wage increment`
        );
      }
    }
    setIsSubmitting(false); // Reset submission flag
  };

  if (!staffId || typeof staffId !== "string" || staffId.trim() === "") {
    return null; // Prevent rendering if staffId is invalid
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-6">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Wage Increment" : "Add Wage Increment"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            {submitError}
          </div>
        )}

        {errors.staffId && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            {errors.staffId}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-2 p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              Current Daily Wage: <span className="font-semibold">₹{Number(currentWage).toFixed(2)}</span>
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              New Daily Wage (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min={Number(currentWage) + 0.01}
              value={formData.newWage}
              onChange={(e) => setFormData({ ...formData, newWage: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.newWage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter new wage"
            />
            {errors.newWage && <p className="mt-1 text-xs text-red-500">{errors.newWage}</p>}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Effective Date *
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.effectiveDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.effectiveDate && <p className="mt-1 text-xs text-red-500">{errors.effectiveDate}</p>}
          </div>

          {formData.newWage && parseFloat(formData.newWage) > parseFloat(currentWage) && (
            <div className="col-span-2 p-4 rounded-lg bg-green-50">
              <p className="text-sm text-green-700">
                Increment: <span className="font-semibold">₹{incrementAmount.toFixed(2)}</span>
                {" "}({incrementPercentage}%)
              </p>
            </div>
          )}

          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Reason *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter reason for increment..."
            />
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Approved By
            </label>
            <input
              type="text"
              value={formData.approvedBy}
              onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter approver's name (optional)"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter additional notes (optional)"
            />
          </div>

          <div className="flex col-span-2 gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={addLoading || editLoading || isSubmitting || Object.keys(errors).length > 0}
              className="flex items-center justify-center flex-1 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(addLoading || editLoading || isSubmitting) ? (
                <>
                  <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                  {mode === "edit" ? "Updating..." : "Adding..."}
                </>
              ) : (
                mode === "edit" ? "Update Increment" : "Add Increment"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWageIncrementForm;