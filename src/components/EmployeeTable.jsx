import '../styles/table.css';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const EmployeeTable = ({ employees, isLoading, onEdit, onDelete, isDeletingId }) => {
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <div className="table-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>No employees found</h3>
          <p>Start by adding a new employee to get started.</p>
        </div>
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
      <div className="table-header">
        <h3>
          Employee Directory
          <span className="record-count"> ({employees.length} {employees.length === 1 ? 'employee' : 'employees'})</span>
        </h3>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {getInitials(emp.full_name)}
                    </div>
                    <span className="employee-name">{emp.full_name}</span>
                  </div>
                </td>
                <td>
                  <span className="emp-id">{emp.employee_id}</span>
                </td>
                <td>
                  <span className="employee-email">{emp.email}</span>
                </td>
                <td>
                  <span className="dept-cell">{emp.department}</span>
                </td>
                <td>
                  <div className="actions-cell">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
