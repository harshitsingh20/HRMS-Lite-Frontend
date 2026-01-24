import { useState, useEffect } from 'react';
import { AttendanceForm } from '../components/AttendanceForm';
import { AttendanceTable } from '../components/AttendanceTable';
import { employeeService, attendanceService } from '../services/api';
import '../styles/page.css';

export const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [error, setError] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');

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
        setAttendanceRecords(response.data || []);
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

  const handleEmployeeFilter = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    fetchAttendance(employeeId);
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
        // Refresh attendance based on current filter
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
        setAttendanceRecords((prev) => prev.filter((record) => record.id !== id));
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
        </div>

        <div className="table-section">
          <div className="filter-section">
            <label htmlFor="employee-filter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter by Employee:
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
          {error && <div className="error-message" style={{ margin: '16px' }}>{error}</div>}
          <AttendanceTable
            attendanceRecords={attendanceRecords}
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
