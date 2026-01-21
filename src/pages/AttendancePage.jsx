import React, { useState, useEffect } from 'react';
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

  const fetchAttendance = async () => {
    try {
      setIsLoadingAttendance(true);
      const response = await attendanceService.getAll();
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
        const existingIndex = attendanceRecords.findIndex(
          (record) => record.employee_id === data.employee_id && record.date === data.date
        );

        if (existingIndex >= 0) {
          const updated = [...attendanceRecords];
          updated[existingIndex] = response.data;
          setAttendanceRecords(updated);
        } else {
          setAttendanceRecords((prev) => [response.data, ...prev]);
        }
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

  return (
    <div className="page">
      <div className="page-header">
        <h1>Attendance Management</h1>
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
          {error && <div className="error-message">{error}</div>}
          <AttendanceTable
            attendanceRecords={attendanceRecords}
            isLoading={isLoadingAttendance}
            onDelete={handleDelete}
            isDeletingId={isDeletingId || undefined}
            title="All Attendance Records"
          />
        </div>
      </div>
    </div>
  );
};
