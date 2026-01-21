import React from 'react';
import '../styles/table.css';

export const EmployeeTable = ({ employees, isLoading, onEdit, onDelete, isDeletingId }) => {
  if (isLoading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <h3>No employees found</h3>
        <p>Start by adding a new employee to get started.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee? This will also delete their attendance records.')) {
      try {
        await onDelete(id);
      } catch (error) {
        // Error handled by parent
      }
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <button className="btn-small btn-edit" onClick={() => onEdit(emp)}>
                  Edit
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() => handleDelete(emp.id)}
                  disabled={isDeletingId === emp.id}
                >
                  {isDeletingId === emp.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
