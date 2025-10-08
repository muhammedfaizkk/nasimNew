import { useState, useCallback } from "react";
import { useFetchFullSiteStaffReport } from '../../hooks/report/Reporthooks';
import DateFilter from '../../components/admin/filters/DateFilter';
import MobileFilterButton from '../../components/admin/monthlyreport/MobileFilterButton';
import ReportHeader from '../../components/admin/monthlyreport/ReportHeader';
import ReportDisplay from '../../components/admin/monthlyreport/ReportDisplay';
import { FiFilter } from 'react-icons/fi';

const MonthlyReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(false);

  const { report, loading, error, fetchReport } = useFetchFullSiteStaffReport(startDate, endDate);

  const handleApplyDateFilter = useCallback(() => {
    setStartDate(localStartDate);
    setEndDate(localEndDate);
    setShowMobileFilter(false);
    setShowDesktopFilter(false);
  }, [localStartDate, localEndDate]);

  const handleClearDateFilter = useCallback(() => {
    setLocalStartDate('');
    setLocalEndDate('');
    setStartDate('');
    setEndDate('');
  }, []);

  const handleOpenDesktopFilter = () => {
    setShowDesktopFilter(true);
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  };

  const handleCloseDesktopFilter = () => {
    setShowDesktopFilter(false);
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  };

  const handleRefresh = useCallback(() => {
    fetchReport(startDate, endDate);
  }, [fetchReport, startDate, endDate]);

  if (error) {
    return (
      <div className="min-h-screen p-2 bg-gray-50 sm:p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
            <span className="w-5 h-5 text-red-600">!</span>
            <div>
              <h3 className="font-medium text-red-800">Error Loading Report</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border relative min-h-screen bg-gray-50">
      <ReportHeader
        title="Monthly Report"
        period={report?.period}
        loading={loading}
        onRefresh={handleRefresh}
      />

      <div className="w-full max-w-6xl px-2 py-4 mx-auto sm:px-4 sm:py-6">
        {/* Desktop Filter Button */}
        <div className="flex justify-end hidden mb-6 sm:block">
          {!showDesktopFilter ? (
            <button
              onClick={handleOpenDesktopFilter}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <FiFilter className="w-4 h-4" />
              Open Filter
            </button>
          ) : (
            <DateFilter
              startDate={localStartDate}
              endDate={localEndDate}
              onStartDateChange={setLocalStartDate}
              onEndDateChange={setLocalEndDate}
              onApply={handleApplyDateFilter}
              onClear={handleClearDateFilter}
              onClose={handleCloseDesktopFilter}
            />
          )}
        </div>

        {/* Report Content */}
        <div className="p-0 shado roundd-lg bg-wh4ite md:p-sm:p-6">
          <ReportDisplay report={report} loading={loading} />
        </div>
      </div>

      <MobileFilterButton onClick={() => setShowMobileFilter(true)} />

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:hidden">
          <div className="w-full max-w-md max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg p-4">
            <DateFilter
              startDate={localStartDate}
              endDate={localEndDate}
              onStartDateChange={setLocalStartDate}
              onEndDateChange={setLocalEndDate}
              onApply={handleApplyDateFilter}
              onClear={handleClearDateFilter}
              onClose={() => setShowMobileFilter(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReportPage;