import React from 'react';
import '../styles/table.css';

export const AttendanceTable = ({ attendanceRecords, isLoading, onDelete, isDeletingId, title = 'Attendance Records' }) => {
  if (isLoading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  if (attendanceRecords.length === 0) {
    return (
      <div className="empty-state">
        <h3>No attendance records found</h3>
        <p>Mark attendance to see records here.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await onDelete(id);
      } catch (error) {
        // Error handled by parent
      }
    }
  };

  return (
    <div className="table-container">
      <h3>{title}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id} className={`status-${record.status.toLowerCase()}`}>
              <td>{record.emp_id}</td>
              <td>{record.full_name}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>
                <span className={`badge badge-${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </td>
              <td>
                <button
                  className="btn-small btn-delete"
                  onClick={() => handleDelete(record.id)}
                  disabled={isDeletingId === record.id}
                >
                  {isDeletingId === record.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
