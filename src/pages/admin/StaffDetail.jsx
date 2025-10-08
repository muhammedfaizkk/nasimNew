import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StaffInfoCard from "./staffdetails/StaffInfoCard";
import StaffTabs from "./staffdetails/StaffTabs";
import StaffLeavesTab from "./staffdetails/StaffLeavesTab";
import StaffAdvancesTab from "./staffdetails/StaffAdvancesTab";
import StaffIncrementsTab from "./staffdetails/StaffIncrementsTab";
import AddStaff from "../../components/admin/forms/AddStaff";

import {
  useAddStaffLeave,
  useGetPublicStaffById,
  useDeleteStaff,
  useUpdateStaff,
  useDeleteStaffLeave,
  useAddWageIncrement,
  useEditWageIncrement,
} from "../../hooks/staff/Addstaffhooks";

import LoadingSpinner from "../../components/admin/LoadingSpinner";
import StaffNotFound from "../../components/admin/StaffNotFound";
import BackButton from "../../components/admin/BackButton";

const StaffDetail = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("leaves");
  const [showFilter, setShowFilter] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // hooks
  const {
    staff: staffData,
    loading: staffLoading,
    error: staffError,
    getPublicStaffById,
  } = useGetPublicStaffById();

  const {
    loading: addLeaveLoading,
    error: addLeaveError,
    addStaffLeave,
    reset: resetAddLeave,
  } = useAddStaffLeave();

  const {
    loading: deleteLoading,
    error: deleteError,
    deleteStaff,
  } = useDeleteStaff();

  const {
    loading: updateLoading,
    error: updateError,
    updateStaff,
  } = useUpdateStaff();

  const { loading: deleteLeaveLoading, deleteStaffLeave } =
    useDeleteStaffLeave();

  const {
    loading: addIncrementLoading,
    error: addIncrementError,
    addWageIncrement,
    reset: resetAddIncrement,
  } = useAddWageIncrement();

  const {
    loading: updateIncrementLoading,
    error: updateIncrementError,
    editWageIncrement,
    reset: resetUpdateIncrement,
  } = useEditWageIncrement();

  // fetch staff
  useEffect(() => {
    if (staffId && typeof staffId === "string" && staffId.trim() !== "") {
      getPublicStaffById(staffId, dateFilter.startDate, dateFilter.endDate);
    }
  }, [staffId, dateFilter, getPublicStaffById]);

  // cleanup increments
  useEffect(() => {
    return () => {
      resetAddIncrement();
      resetUpdateIncrement();
    };
  }, [resetAddIncrement, resetUpdateIncrement]);

  // delete staff
  const handleDeleteStaff = useCallback(
    async (id) => {
      if (!id) return;
      const result = await deleteStaff(id);
      if (result.success) {
        navigate("/");
      }
    },
    [deleteStaff, navigate]
  );

  const handleEditWage = useCallback(
    async (wageData) => {
      if (!staffData?.data?.staff?._id) {
        setEditError("Staff ID is missing");
        return;
      }
      setEditLoading(true);
      setEditError(null);
      try {
        const { incrementId, ...updateFields } = wageData;
        let result;

        const baseWage = staffData?.data?.staff?.currentDailyWage || 1;

        if (incrementId) {
          // Edit mode: Ensure incrementId is valid
          if (typeof incrementId !== "string" || incrementId.trim() === "") {
            throw new Error("Invalid increment ID provided");
          }
          result = await editWageIncrement(staffId, incrementId, updateFields);
        } else {
          // Add mode
          result = await addWageIncrement(staffId, {
            ...updateFields,
            previousWage: baseWage,
            incrementAmount: updateFields.newWage - baseWage,
            incrementPercentage: (
              ((updateFields.newWage - baseWage) / baseWage) *
              100
            ).toFixed(2),
          });
        }

        if (result.success) {
          await getPublicStaffById(
            staffId,
            dateFilter.startDate,
            dateFilter.endDate
          );
        } else {
          setEditError(
            (incrementId ? updateIncrementError : addIncrementError) ||
              `Failed to ${incrementId ? "update" : "add"} wage increment`
          );
        }
      } catch (err) {
        setEditError(
          err.message ||
            `Failed to ${incrementId ? "update" : "add"} wage increment`
        );
      } finally {
        setEditLoading(false);
      }
    },
    [
      staffData,
      staffId,
      dateFilter,
      getPublicStaffById,
      editWageIncrement,
      addWageIncrement,
      updateIncrementError,
      addIncrementError,
    ]
  );

  // edit staff
  const handleEditStaff = async (formData) => {
    if (!staffData?.data?.staff?._id) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const result = await updateStaff(staffData.data.staff._id, formData);
      if (result.success) {
        await getPublicStaffById(
          staffId,
          dateFilter.startDate,
          dateFilter.endDate
        );
        setShowEditModal(false);
      } else {
        setEditError(updateError || "Failed to update staff");
      }
    } catch (err) {
      setEditError(err.message || "Failed to update staff");
    } finally {
      setEditLoading(false);
    }
  };

  // add leave
  const handleLeaveSubmit = async (leaveData) => {
    try {
      const result = await addStaffLeave(staffId, leaveData);
      if (result.success) {
        await getPublicStaffById(
          staffId,
          dateFilter.startDate,
          dateFilter.endDate
        );
        setShowLeaveForm(false);
        resetAddLeave();
      } else {
        console.error("Error submitting leave:", addLeaveError);
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
    }
  };

  const handleBack = () => {
    navigate("/admin/staff");
  };

  const isLoading =
    staffLoading ||
    deleteLoading ||
    updateLoading ||
    editLoading ||
    addIncrementLoading ||
    updateIncrementLoading;

  if (isLoading && !staffData) {
    return <LoadingSpinner message="Loading staff details..." />;
  }

  if (!staffData?.data) {
    return <StaffNotFound onBack={handleBack} />;
  }

  // extract safe data
  const { staff, period, attendance, finances, wageInfo } = staffData.data;

  const basicStaff = {
    ...staff,
    dailyWage: wageInfo?.appliedWage ?? staff?.dailyWage,
  };

  const salaryDetails = {
    currentDailyWage: staff?.currentDailyWage ?? 0,
    wagePerDay: wageInfo?.wagePerDay ?? 0,
    dailyWage: wageInfo?.appliedWage ?? staff?.dailyWage ?? 0,
    daysInMonth: period?.totalDays ?? 0,
    daysWorked: attendance?.daysWorked ?? 0,
    leaveDays: attendance?.leaveDays ?? 0,
    advancePaid: finances?.advancePaid ?? 0,
    monthlySalary: finances?.monthlySalary ?? 0,
    finalSalary: finances?.finalSalary ?? 0,
  };

  const safeLeaveData = Array.isArray(attendance?.leaveData)
    ? attendance.leaveData
    : [];
  const safeAdvances = Array.isArray(finances?.advances)
    ? finances.advances
    : [];

  return (
    <div className="min-h-screen p-0 bg-gray-50 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <BackButton onBack={handleBack} />

        {/* show global errors */}
        {(staffError || deleteError || updateError || editError) && (
          <p className="mb-4 text-red-500">
            {staffError || deleteError || updateError || editError}
          </p>
        )}

        <StaffInfoCard
          staffId={staff?._id}
          staffData={basicStaff}
          salaryDetails={salaryDetails}
          onDelete={handleDeleteStaff}
          onEditWage={handleEditWage}
          onEdit={() => setShowEditModal(true)}
        />

        <StaffTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          handleDateFilterChange={setDateFilter}
          leavesLoading={addLeaveLoading || deleteLeaveLoading}
          advancesLoading={isLoading}
          incrementLoading={addIncrementLoading || updateIncrementLoading}
        />

        <div className="p-1 bg-white border shadow-md rounded-xl sm:p-6">
          {activeTab === "leaves" && (
            <StaffLeavesTab
              staffId={staff?._id}
              leaves={safeLeaveData}
              leavesLoading={isLoading}
              showLeaveForm={showLeaveForm}
              setShowLeaveForm={setShowLeaveForm}
              handleRefreshLeaves={() =>
                getPublicStaffById(
                  staff?._id,
                  dateFilter.startDate,
                  dateFilter.endDate
                )
              }
              handleLeaveSubmit={handleLeaveSubmit}
              addLeaveLoading={addLeaveLoading}
              resetAddLeave={resetAddLeave}
              deleteStaffLeave={deleteStaffLeave}
              deleteLeaveLoading={deleteLeaveLoading}
            />
          )}

          {activeTab === "payments" && (
            <StaffAdvancesTab
              staffId={staff?._id}
              staffAdvances={safeAdvances}
              advancesLoading={isLoading}
              handleRefreshAdvances={() =>
                getPublicStaffById(
                  staff?._id,
                  dateFilter.startDate,
                  dateFilter.endDate
                )
              }
            />
          )}

          {activeTab === "increments" && (
            <StaffIncrementsTab
              staffId={staffId}
              incrementHistory={wageInfo?.wageIncrements || []}
              incrementLoading={addIncrementLoading || updateIncrementLoading}
              incrementsThisMonth={wageInfo?.wageIncrementsThisMonth || []}
              currentWage={staff?.currentDailyWage ?? 0}
              onEditWage={handleEditWage}
              getPublicStaffById={getPublicStaffById}
            />
          )}
        </div>

        {showEditModal && (
          <AddStaff
            mode="edit"
            staff={basicStaff}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditStaff}
            loading={editLoading}
            error={editError}
          />
        )}
      </div>
    </div>
  );
};

export default StaffDetail;
