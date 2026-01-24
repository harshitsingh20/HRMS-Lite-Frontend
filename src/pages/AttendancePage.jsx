import { useState, useEffect } from 'react';
import { AttendanceForm } from '../components/AttendanceForm';
import { AttendanceTable } from '../components/AttendanceTable';
import { employeeService, attendanceService } from '../services/api';
import '../styles/page.css';

export const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [error, setError] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch employees');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch employees';
      setError(errorMessage);
    }
  };

  const fetchAttendance = async (employeeId = 'all') => {
    try {
      setIsLoadingAttendance(true);
      setError(null);
      let response;

      if (employeeId === 'all') {
        response = await attendanceService.getAll();
      } else {
        response = await attendanceService.getByEmployee(employeeId);
      }

      if (response.success) {
        const records = response.data || [];
        setAttendanceRecords(records);
        applyDateFilter(records, startDate, endDate);
      } else {
        setError(response.message || 'Failed to fetch attendance records');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch attendance records';
      setError(errorMessage);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  const applyDateFilter = (records, start, end) => {
    let filtered = records;

    if (start) {
      filtered = filtered.filter(r => r.date >= start);
    }
    if (end) {
      filtered = filtered.filter(r => r.date <= end);
    }

    setFilteredRecords(filtered);
  };

  const handleEmployeeFilter = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    fetchAttendance(employeeId);
  };

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    applyDateFilter(attendanceRecords, date, endDate);
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    setEndDate(date);
    applyDateFilter(attendanceRecords, startDate, date);
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredRecords(attendanceRecords);
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleSubmit = async (data) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await attendanceService.mark(data);
      if (response.success) {
        fetchAttendance(selectedEmployeeId);
      } else {
        setSubmitError(response.message || 'Failed to mark attendance');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeletingId(id);

    try {
      const response = await attendanceService.delete(id);
      if (response.success) {
        const newRecords = attendanceRecords.filter((record) => record.id !== id);
        setAttendanceRecords(newRecords);
        applyDateFilter(newRecords, startDate, endDate);
      } else {
        setError(response.message || 'Failed to delete attendance record');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete attendance record';
      setError(errorMessage);
    } finally {
      setIsDeletingId(null);
    }
  };

  const getSelectedEmployeeName = () => {
    if (selectedEmployeeId === 'all') return null;
    const employee = employees.find(e => e.id === parseInt(selectedEmployeeId));
    return employee?.full_name || 'Selected Employee';
  };

  // Calculate stats
  const presentCount = filteredRecords.filter(r => r.status === 'Present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'Absent').length;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Attendance Management</h1>
          <p>Track and manage employee attendance records</p>
        </div>
      </div>

      <div className="page-content">
        <div className="form-section">
          <AttendanceForm
            employees={employees}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            error={submitError || undefined}
          />

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item present">
              <span className="stat-value">{presentCount}</span>
              <span className="stat-label">Present</span>
            </div>
            <div className="stat-item absent">
              <span className="stat-value">{absentCount}</span>
              <span className="stat-label">Absent</span>
            </div>
          </div>
        </div>

        <div className="table-section">
          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="employee-filter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                Employee:
              </label>
              <select
                id="employee-filter"
                value={selectedEmployeeId}
                onChange={handleEmployeeFilter}
              >
                <option value="all">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="start-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                From:
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="end-date">To:</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>

            {(startDate || endDate) && (
              <button className="btn-outline btn-small" onClick={clearDateFilter}>
                Clear Dates
              </button>
            )}
          </div>

          {error && <div className="error-message" style={{ margin: '16px' }}>{error}</div>}
          <AttendanceTable
            attendanceRecords={filteredRecords}
            isLoading={isLoadingAttendance}
            onDelete={handleDelete}
            isDeletingId={isDeletingId || undefined}
            title={selectedEmployeeId === 'all' ? 'All Attendance Records' : `Attendance for ${getSelectedEmployeeName()}`}
          />
        </div>
      </div>
    </div>
  );
};
