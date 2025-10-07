// StaffManagement.jsx
import { useState, useEffect } from "react";
import StaffFilter from "../../components/admin/filters/StaffFilter";
import StaffCards from "../../components/admin/cards/StaffCards";
import StaffDetail from "../../pages/admin/StaffDetail";
import { useNavigate } from "react-router-dom";
import AddStaff from "../../components/admin/forms/AddStaff";
import { useGetAllStaff, useAddStaff } from "../../hooks/staff/Addstaffhooks";
import StaffCardsSkeleton from "../../skeletons/StaffCardSkeleton";

const StaffManagement = () => {
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    department: "",
    search: "",
  });
  const { staff, loading, error, getAllStaff } = useGetAllStaff();
  const { addStaff, loading: addLoading, error: addError } = useAddStaff();

  const navigate = useNavigate();
  useEffect(() => {
    getAllStaff();
  }, [getAllStaff]);

  useEffect(() => {
    // Start with all staff (deleted and non-deleted)
    let filtered = staff || [];

    // Apply department filter
    if (filterCriteria.department) {
      filtered = filtered.filter(
        (member) =>
          member.role?.toLowerCase() === filterCriteria.department.toLowerCase()
      );
    }

    // Apply search filter
    if (filterCriteria.search) {
      const searchTerm = filterCriteria.search.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchTerm) ||
          member.role?.toLowerCase().includes(searchTerm) ||
          member.email?.toLowerCase().includes(searchTerm) ||
          member.phone?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredStaff(filtered);
  }, [staff, filterCriteria]);

  const handleStaffClick = (id) => {
    navigate(`/staffdetail/${id}`);
  };

  const handleFilterChange = (department) => {
    setFilterCriteria((prev) => ({ ...prev, department }));
  };

  const handleSearch = (searchTerm) => {
    setFilterCriteria((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleAddStaff = async (newStaffData) => {
    try {
      const result = await addStaff(newStaffData);
      if (result.success) {
        setShowAddStaff(false);
        // Refresh the staff list
        getAllStaff();
        // Show success message (you can use a toast library)
        console.log("Staff member added successfully!");
      } else {
        console.error("Failed to add staff member");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  if (loading && !staff.length) {
    return (
      <div>
        <StaffCardsSkeleton />
      </div>
    );
  }

  // Error state
  if (error && !staff.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            Error loading staff members: {error.message}
          </p>
          <button
            onClick={getAllStaff}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 bg-gray-50 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between gap-4 mb-4 sm:items-center sm:mb-6">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl sm:mb-2">
              Staffs
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              {filteredStaff.length} of {staff.length} staff members
            </p>
          </div>

          <button
            onClick={() => setShowAddStaff(true)}
            disabled={addLoading}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addLoading ? "Adding..." : "Add Staff"}
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <StaffFilter
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            departments={[...new Set(staff.map((member) => member.role))]}
          />
        </div>

        <StaffCards
          staff={filteredStaff}
          onStaffClick={handleStaffClick}
          loading={loading}
        />

        {showAddStaff && (
          <AddStaff
            onClose={() => setShowAddStaff(false)}
            onSubmit={handleAddStaff}
            loading={addLoading}
            error={addError}
          />
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
