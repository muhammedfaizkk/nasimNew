import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiUsers, FiCalendar, FiUser, FiBriefcase, FiClock, FiCreditCard, FiBarChart } from 'react-icons/fi';

const ReportDisplay = ({ report, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading report...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-8 text-center">
        <FiUsers className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-2 text-gray-600">No report data available</p>
      </div>
    );
  }

  const { period, finance, staffReports, staffTotals } = report;

  // Format date for display
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Format currency
  const formatCurrency = (value) => `₹${(value || 0).toLocaleString('en-IN')}`;

  return (
    <div className="p-0 space-y-6 md:p-4 p">
      {/* Period Summary */}
      <section className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
          <FiCalendar className="text-blue-600" /> Report Period
        </h3>
        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-medium">{formatDate(period.start)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="font-medium">{formatDate(period.end)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="font-medium">{period.totalDays || 0}</p>
          </div>
        </div>
      </section>

      {/* Finance Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <h4 className="flex items-center gap-2 mb-2 font-medium text-green-800">
            <FiTrendingUp className="text-green-600" /> Total Income
          </h4>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(finance.totalIncome)}</p>
        </div>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h4 className="flex items-center gap-2 mb-2 font-medium text-red-800">
            <FiTrendingDown className="text-red-600" /> Total Expense
          </h4>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(finance.totalExpense)}</p>
        </div>
        <div className={`p-4 rounded-lg border ${finance.balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <h4 className={`flex items-center gap-2 font-medium ${finance.balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
            <FiDollarSign className={finance.balance >= 0 ? 'text-blue-600' : 'text-red-600'} /> Balance
          </h4>
          <p className={`text-2xl font-bold ${finance.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {formatCurrency(finance.balance)}
          </p>
        </div>
      </section>

      {/* Staff Summary */}
      <section className="p-4 border border-purple-200 rounded-lg bg-purple-50">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
          <FiUsers className="text-purple-600" /> Staff Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Total Salary</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(staffTotals.totalSalary)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Advance</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(staffTotals.totalAdvance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(staffTotals.balance)}</p>
          </div>
        </div>
      </section>

      {/* Staff Details */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Staff Details</h3>
        {/* Desktop Table */}
        <div className="hidden overflow-hidden bg-white rounded-lg shadow md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Staff', 'Role', 'Daily Wage', 'Days Worked', 'Leave Days', 'Advance', 'Salary', 'Balance'].map((header) => (
                  <th key={header} className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffReports.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="ml-4 text-sm font-medium text-gray-900">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{staff.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(staff.dailyWage)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{staff.daysWorked}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{staff.leaveDays}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(staff.totalAdvance)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(staff.totalSalary)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">{formatCurrency(staff.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {staffReports.map((staff) => (
            <div key={staff.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{staff.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiBriefcase className="w-3 h-3" /> {staff.role}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-gray-400" />
                  <span>Daily Wage: {formatCurrency(staff.dailyWage)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <span>Days Worked: {staff.daysWorked}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <span>Leave Days: {staff.leaveDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCreditCard className="w-4 h-4 text-gray-400" />
                  <span>Advance: {formatCurrency(staff.totalAdvance)}</span>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Salary:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(staff.totalSalary)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(staff.balance)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Summary */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
          <FiBarChart className="text-gray-600" /> Final Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="mb-2 text-sm font-medium text-gray-600">Financial Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Income:</span>
                <span className="font-medium text-green-600">{formatCurrency(finance.totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expense:</span>
                <span className="font-medium text-red-600">{formatCurrency(finance.totalExpense)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-700">Net Balance:</span>
                <span className={`font-bold ${finance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(finance.balance)}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="mb-2 text-sm font-medium text-gray-600">Staff Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Salary:</span>
                <span className="font-medium text-purple-600">{formatCurrency(staffTotals.totalSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Advance:</span>
                <span className="font-medium text-orange-600">{formatCurrency(staffTotals.totalAdvance)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-700">Staff Balance:</span>
                <span className="font-bold text-purple-600">{formatCurrency(staffTotals.balance)}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="mb-2 text-sm font-medium text-gray-600">Period Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{formatDate(period.start)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{formatDate(period.end)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-700">Total Days:</span>
                <span className="font-bold text-blue-600">{period.totalDays || 0}</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ReportDisplay;